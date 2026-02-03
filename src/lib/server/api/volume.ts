/**
 * @fileoverview Volume Calculation Engine
 *
 * Core engine for calculating weekly training volume per muscle and determining
 * if volume is under/optimal/over based on science-backed thresholds (MEV/MRV).
 *
 * @description
 * This module provides:
 * - Pure calculation functions (no DB access, fully testable)
 * - Database functions for fetching muscle/exercise data
 * - Main `calculateVolume()` function that combines everything
 *
 * @example Exercise-based input (uses activation weighting from exerciseMuscle table)
 * ```ts
 * const result = await calculateVolume({
 *   exercises: [
 *     { exerciseId: 1, sets: 3 },  // e.g., Bench Press
 *     { exerciseId: 5, sets: 4 }   // e.g., Incline Dumbbell Press
 *   ]
 * });
 * ```
 *
 * @example Direct muscle input (bypasses exercise lookup)
 * ```ts
 * const result = await calculateVolume({
 *   directVolume: [
 *     { muscleId: 1, sets: 12 },  // e.g., Chest - 12 direct sets
 *     { muscleId: 3, sets: 8 }    // e.g., Triceps - 8 direct sets
 *   ]
 * });
 * ```
 *
 * @example Combined input (exercises + direct volume)
 * ```ts
 * const result = await calculateVolume({
 *   exercises: [{ exerciseId: 1, sets: 3 }],
 *   directVolume: [{ muscleId: 7, sets: 6 }]  // Add extra sets for a muscle
 * });
 * ```
 *
 * @module volume
 */

import { eq, inArray } from 'drizzle-orm';

import { db } from '../db';
import { muscle, exerciseMuscle } from '../db/schema';

// ============ TYPES ============

/**
 * Volume zone status indicating training volume adequacy.
 * - `"under"` - Below MEV (Minimum Effective Volume) - not enough stimulus
 * - `"optimal"` - Between MEV and MRV - productive training range
 * - `"over"` - Above MRV (Maximum Recoverable Volume) - exceeding recovery
 */
export type VolumeZone = 'under' | 'optimal' | 'over';

/**
 * Volume thresholds for a single muscle (sets per week).
 * Values come from the `muscle` table in the database.
 */
export interface MuscleThresholds {
	/** Minimum Effective Volume - below this, no growth stimulus */
	mev: number | null;
	/** Maximum Adaptive Volume (minimum) - start of optimal range */
	mavMin: number | null;
	/** Maximum Adaptive Volume (maximum) - end of optimal range */
	mavMax: number | null;
	/** Maximum Recoverable Volume - above this, recovery is impaired */
	mrv: number | null;
}

/**
 * Result for a single muscle's volume calculation.
 */
export interface MuscleVolumeResult {
	/** Database ID of the muscle */
	muscleId: number;
	/** Display name of the muscle (e.g., "Chest", "Biceps") */
	muscleName: string;
	/** Calculated effective sets, rounded to whole number */
	effectiveSets: number;
	/** Volume zone status */
	zone: VolumeZone;
	/** The thresholds used for zone calculation */
	thresholds: MuscleThresholds;
}

/**
 * Summary of volume zones across all muscles.
 */
export interface VolumeSummary {
	/** Total number of muscles in the calculation */
	totalMuscles: number;
	/** Muscle names in the "under" zone */
	under: string[];
	/** Muscle names in the "optimal" zone */
	optimal: string[];
	/** Muscle names in the "over" zone */
	over: string[];
}

/**
 * Warning generated during volume calculation.
 */
export interface VolumeWarning {
	/** Warning type identifier */
	type: 'unknown_muscle_id';
	/** Human-readable warning message */
	message: string;
	/** The muscle ID that caused the warning */
	muscleId: number;
}

/**
 * Full response from volume calculation.
 */
export interface VolumeCalculationResult {
	/** Per-muscle volume results */
	muscles: MuscleVolumeResult[];
	/** Summary of zones across all muscles */
	summary: VolumeSummary;
	/** Warnings generated during calculation (e.g., unknown muscle IDs) */
	warnings: VolumeWarning[];
}

/**
 * Exercise-based input for volume calculation.
 * Uses activation weighting from the `exerciseMuscle` table.
 */
export interface ExerciseInput {
	/** Database ID of the exercise */
	exerciseId: number;
	/** Number of sets performed */
	sets: number;
}

/**
 * Direct muscle input for volume calculation.
 * Bypasses exercise lookup - sets count 1:1 for the specified muscle.
 */
export interface DirectVolumeInput {
	/** Database ID of the muscle */
	muscleId: number;
	/** Number of direct sets for this muscle */
	sets: number;
}

/**
 * Combined request input for volume calculation.
 * At least one of `exercises` or `directVolume` must be provided.
 */
export interface VolumeRequest {
	/** Exercise-based input (precise, uses activation weighting) */
	exercises?: ExerciseInput[];
	/** Direct muscle input (simple, bypasses exercise lookup) */
	directVolume?: DirectVolumeInput[];
}

// ============ PURE CALCULATION FUNCTIONS ============

/**
 * Determines the volume zone based on effective sets and thresholds.
 *
 * Zone logic:
 * - `"under"`: effectiveSets < MEV
 * - `"optimal"`: MEV <= effectiveSets <= MRV
 * - `"over"`: effectiveSets > MRV
 *
 * @param effectiveSets - The calculated effective sets for a muscle
 * @param thresholds - The muscle's volume thresholds (MEV, MAV, MRV)
 * @returns The volume zone status
 *
 * @example
 * ```ts
 * const zone = calculateZone(8, { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 });
 * // Returns: "under" (8 < 10)
 *
 * const zone2 = calculateZone(15, { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 });
 * // Returns: "optimal" (10 <= 15 <= 22)
 *
 * const zone3 = calculateZone(25, { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 });
 * // Returns: "over" (25 > 22)
 * ```
 *
 * @remarks
 * - If MEV is null, the muscle cannot be "under" (defaults to optimal)
 * - If MRV is null, the muscle cannot be "over" (defaults to optimal)
 * - If all thresholds are null, always returns "optimal"
 */
export function calculateZone(effectiveSets: number, thresholds: MuscleThresholds): VolumeZone {
	const { mev, mrv } = thresholds;

	// Check if under minimum effective volume
	if (mev !== null && effectiveSets < mev) {
		return 'under';
	}

	// Check if over maximum recoverable volume
	if (mrv !== null && effectiveSets > mrv) {
		return 'over';
	}

	// Everything else is optimal (including when thresholds are null)
	return 'optimal';
}

/**
 * Rounds effective sets to a whole number for display.
 *
 * @param sets - The raw effective sets (may have decimals from weighting)
 * @returns Rounded whole number
 *
 * @example
 * ```ts
 * roundSets(5.85);  // Returns: 6
 * roundSets(5.4);   // Returns: 5
 * ```
 *
 * @remarks
 * Internal calculations maintain precision, but users see clean whole numbers.
 */
export function roundSets(sets: number): number {
	return Math.round(sets);
}

/**
 * Builds a summary object categorizing muscles by their volume zone.
 *
 * @param muscles - Array of muscle volume results
 * @returns Summary with muscles grouped by zone
 *
 * @example
 * ```ts
 * const summary = buildSummary([
 *   { muscleName: 'Chest', zone: 'optimal', ... },
 *   { muscleName: 'Back', zone: 'under', ... },
 *   { muscleName: 'Shoulders', zone: 'over', ... }
 * ]);
 * // Returns:
 * // {
 * //   totalMuscles: 3,
 * //   under: ['Back'],
 * //   optimal: ['Chest'],
 * //   over: ['Shoulders']
 * // }
 * ```
 */
export function buildSummary(muscles: MuscleVolumeResult[]): VolumeSummary {
	const summary: VolumeSummary = {
		totalMuscles: muscles.length,
		under: [],
		optimal: [],
		over: []
	};

	for (const muscleResult of muscles) {
		summary[muscleResult.zone].push(muscleResult.muscleName);
	}

	return summary;
}

// ============ DATABASE FUNCTIONS ============

/**
 * Fetches all muscles from the database with their volume thresholds.
 *
 * @returns Map of muscleId to muscle data (name + thresholds)
 *
 * @example
 * ```ts
 * const musclesMap = await getMusclesWithThresholds();
 * const chestData = musclesMap.get(1);
 * // { name: 'Chest', thresholds: { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 } }
 * ```
 *
 * @remarks
 * Used for direct volume input where we need threshold data without
 * going through the exercise-muscle mapping.
 */
export async function getMusclesWithThresholds(): Promise<
	Map<
		number,
		{
			name: string;
			thresholds: MuscleThresholds;
		}
	>
> {
	const muscles = await db.select().from(muscle);

	const muscleThresholdsMap = new Map();
	for (const muscleRow of muscles) {
		muscleThresholdsMap.set(muscleRow.id, {
			name: muscleRow.name,
			thresholds: {
				mev: muscleRow.mev,
				mavMin: muscleRow.mavMin,
				mavMax: muscleRow.mavMax,
				mrv: muscleRow.mrv
			}
		});
	}

	return muscleThresholdsMap;
}

/**
 * Calculates effective volume per muscle from exercise inputs.
 *
 * Uses the `exerciseMuscle.weighting` field to calculate how much each
 * exercise contributes to each muscle's volume.
 *
 * @param exercises - Array of exercise inputs with sets
 * @returns Map of muscleId to volume data (name, raw sets, thresholds)
 *
 * @example
 * ```ts
 * // If Bench Press (id: 1) has:
 * //   - Chest weighting: 0.75
 * //   - Triceps weighting: 0.25
 * //   - Front Delts weighting: 0.15
 *
 * const volumeMap = await calculateVolumeFromExercises([
 *   { exerciseId: 1, sets: 4 }
 * ]);
 *
 * // Result:
 * // Chest: 4 * 0.75 = 3.0 effective sets
 * // Triceps: 4 * 0.25 = 1.0 effective sets
 * // Front Delts: 4 * 0.15 = 0.6 effective sets
 * ```
 *
 * @remarks
 * - If an exercise has no weighting defined, defaults to 1.0 (full credit)
 * - Multiple exercises for the same muscle are aggregated
 * - Returns empty Map if exercises array is empty
 */
export async function calculateVolumeFromExercises(
	exercises: ExerciseInput[]
): Promise<Map<number, { muscleName: string; rawSets: number; thresholds: MuscleThresholds }>> {
	if (exercises.length === 0) {
		return new Map();
	}

	const exerciseIds = exercises.map((exerciseInput) => exerciseInput.exerciseId);

	// Create a map of exerciseId -> sets for quick lookup
	const setsMap = new Map<number, number>();
	for (const exerciseInput of exercises) {
		setsMap.set(
			exerciseInput.exerciseId,
			(setsMap.get(exerciseInput.exerciseId) || 0) + exerciseInput.sets
		);
	}

	// Get all exercise-muscle mappings for the given exercises
	const mappings = await db
		.select({
			exerciseId: exerciseMuscle.exerciseId,
			muscleId: exerciseMuscle.muscleId,
			weighting: exerciseMuscle.weighting,
			muscleName: muscle.name,
			mev: muscle.mev,
			mavMin: muscle.mavMin,
			mavMax: muscle.mavMax,
			mrv: muscle.mrv
		})
		.from(exerciseMuscle)
		.innerJoin(muscle, eq(exerciseMuscle.muscleId, muscle.id))
		.where(inArray(exerciseMuscle.exerciseId, exerciseIds));

	// Aggregate volume per muscle
	const volumeMap = new Map<
		number,
		{ muscleName: string; rawSets: number; thresholds: MuscleThresholds }
	>();

	for (const mapping of mappings) {
		const sets = setsMap.get(mapping.exerciseId) || 0;
		const weighting = mapping.weighting ?? 1; // Default to 1 if no weighting
		const effectiveSets = sets * weighting;

		const existing = volumeMap.get(mapping.muscleId);
		if (existing) {
			existing.rawSets += effectiveSets;
		} else {
			volumeMap.set(mapping.muscleId, {
				muscleName: mapping.muscleName,
				rawSets: effectiveSets,
				thresholds: {
					mev: mapping.mev,
					mavMin: mapping.mavMin,
					mavMax: mapping.mavMax,
					mrv: mapping.mrv
				}
			});
		}
	}

	return volumeMap;
}

// ============ MAIN CALCULATION FUNCTION ============

/**
 * Main entry point for volume calculation.
 *
 * Calculates effective training volume for all muscles based on the provided
 * input and determines the volume zone (under/optimal/over) for each.
 *
 * @param request - The volume calculation request
 * @param request.exercises - Exercise-based input (uses activation weighting)
 * @param request.directVolume - Direct muscle input (bypasses exercise lookup)
 * @returns Volume results per muscle with zone status and summary
 *
 * @example Exercise-based calculation
 * ```ts
 * const result = await calculateVolume({
 *   exercises: [
 *     { exerciseId: 1, sets: 4 },   // Bench Press
 *     { exerciseId: 12, sets: 3 },  // Incline DB Press
 *     { exerciseId: 25, sets: 3 }   // Cable Flyes
 *   ]
 * });
 *
 * // Returns:
 * // {
 * //   muscles: [
 * //     { muscleId: 1, muscleName: 'Chest', effectiveSets: 8, zone: 'under', ... },
 * //     { muscleId: 3, muscleName: 'Triceps', effectiveSets: 4, zone: 'under', ... },
 * //     ...
 * //   ],
 * //   summary: {
 * //     totalMuscles: 3,
 * //     under: ['Chest', 'Triceps'],
 * //     optimal: ['Front Delts'],
 * //     over: []
 * //   }
 * // }
 * ```
 *
 * @example Direct muscle input
 * ```ts
 * const result = await calculateVolume({
 *   directVolume: [
 *     { muscleId: 1, sets: 15 },  // Chest - 15 direct sets
 *     { muscleId: 2, sets: 18 }   // Back - 18 direct sets
 *   ]
 * });
 * ```
 *
 * @example Combined input (tracked exercises + extra work)
 * ```ts
 * const result = await calculateVolume({
 *   exercises: [{ exerciseId: 1, sets: 4 }],
 *   directVolume: [{ muscleId: 1, sets: 6 }]  // Add 6 more chest sets
 * });
 * // Exercise and direct sets are combined for the same muscle
 * ```
 *
 * @remarks
 * - At least one of `exercises` or `directVolume` must be provided
 * - Exercise-based input uses the `exerciseMuscle.weighting` for precision
 * - Direct input counts 1:1 for the specified muscle
 * - When both are provided for the same muscle, sets are summed
 * - Results are sorted alphabetically by muscle name
 * - Unknown muscle IDs in directVolume generate a warning (not silently skipped)
 */
export async function calculateVolume(request: VolumeRequest): Promise<VolumeCalculationResult> {
	const { exercises = [], directVolume = [] } = request;

	// Start with a map to accumulate volume per muscle
	// Key: muscleId, Value: { muscleName, rawSets, thresholds }
	const volumeMap = new Map<
		number,
		{ muscleName: string; rawSets: number; thresholds: MuscleThresholds }
	>();

	// Track warnings
	const warnings: VolumeWarning[] = [];

	// Process exercise-based input
	if (exercises.length > 0) {
		const exerciseVolume = await calculateVolumeFromExercises(exercises);
		for (const [muscleId, volumeData] of exerciseVolume) {
			volumeMap.set(muscleId, volumeData);
		}
	}

	// Process direct muscle input
	if (directVolume.length > 0) {
		const musclesData = await getMusclesWithThresholds();

		for (const directVolumeEntry of directVolume) {
			const muscleData = musclesData.get(directVolumeEntry.muscleId);
			if (!muscleData) {
				// Warn about unknown muscle IDs instead of silently skipping
				warnings.push({
					type: 'unknown_muscle_id',
					message: `Unknown muscle ID: ${directVolumeEntry.muscleId}. This muscle was skipped in calculations.`,
					muscleId: directVolumeEntry.muscleId
				});
				continue;
			}

			const existing = volumeMap.get(directVolumeEntry.muscleId);
			if (existing) {
				// Add to existing (combine exercise + direct)
				existing.rawSets += directVolumeEntry.sets;
			} else {
				volumeMap.set(directVolumeEntry.muscleId, {
					muscleName: muscleData.name,
					rawSets: directVolumeEntry.sets,
					thresholds: muscleData.thresholds
				});
			}
		}
	}

	// Convert map to results array
	const muscleResults: MuscleVolumeResult[] = [];

	for (const [muscleId, volumeData] of volumeMap) {
		const effectiveSets = roundSets(volumeData.rawSets);
		const zone = calculateZone(volumeData.rawSets, volumeData.thresholds);

		muscleResults.push({
			muscleId,
			muscleName: volumeData.muscleName,
			effectiveSets,
			zone,
			thresholds: volumeData.thresholds
		});
	}

	// Sort by muscle name for consistent output
	muscleResults.sort((a, b) => a.muscleName.localeCompare(b.muscleName));

	// Build summary
	const summary = buildSummary(muscleResults);

	return { muscles: muscleResults, summary, warnings };
}
