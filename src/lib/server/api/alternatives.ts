import { eq, ne } from 'drizzle-orm';

import { db } from '../db';
import { muscle, exercise, equipment, exerciseMuscle, exerciseEquipment } from '../db/schema';

// ============ TYPES ============

export interface AlternativeFilters {
	availableEquipmentIds?: number[];
	difficulty?: 'same' | 'easier' | 'harder' | 'any';
	excludeExerciseIds?: number[];
	minSimilarity?: number;
	limit?: number;
}

export interface AlternativeExercise {
	exerciseId: number;
	name: string;
	similarity: number;
	matchReasons: string[];
	difficulty: string | null;
	movementPattern: string | null;
	primaryMuscle: string | null;
	equipment: { id: number; name: string }[];
}

export interface AlternativesResult {
	sourceExercise: {
		id: number;
		name: string;
		primaryMuscle: string | null;
		movementPattern: string | null;
	};
	alternatives: AlternativeExercise[];
	totalCandidates: number;
}

// Internal types for scoring
interface ExerciseData {
	id: number;
	name: string;
	difficulty: string | null;
	movementPattern: string | null;
	forceProfile: string | null;
	stretchPosition: string | null;
	muscles: {
		muscleId: number;
		muscleName: string;
		activationType: string | null;
		weighting: number | null;
	}[];
	equipment: { id: number; name: string }[];
}

// ============ SCORING WEIGHTS ============

const WEIGHTS = {
	primaryMuscle: 0.4,
	secondaryMuscle: 0.2,
	movementPattern: 0.2,
	forceProfile: 0.1,
	stretchPosition: 0.1
} as const;

// ============ PURE SCORING FUNCTIONS ============

/** Related movement pattern groups for partial matching */
const MOVEMENT_FAMILIES: Record<string, string> = {
	horizontal_push: 'push',
	vertical_push: 'push',
	horizontal_pull: 'pull',
	vertical_pull: 'pull',
	hip_hinge: 'hinge',
	squat: 'hinge',
	lunge: 'hinge'
};

/**
 * Score primary muscle overlap between two exercises.
 * Compares primary muscles weighted by EMG activation values.
 */
export function scorePrimaryMuscles(
	source: ExerciseData['muscles'],
	candidate: ExerciseData['muscles']
): number {
	const sourcePrimary = source.filter((m) => m.activationType === 'primary');
	const candidatePrimary = candidate.filter((m) => m.activationType === 'primary');

	if (sourcePrimary.length === 0 || candidatePrimary.length === 0) return 0;

	// Check overlap of primary muscle IDs
	const sourceIds = new Set(sourcePrimary.map((m) => m.muscleId));
	const candidateIds = new Set(candidatePrimary.map((m) => m.muscleId));

	let matchCount = 0;
	for (const id of sourceIds) {
		if (candidateIds.has(id)) matchCount++;
	}

	if (matchCount === 0) return 0;

	// Jaccard similarity on primary muscles
	const unionSize = new Set([...sourceIds, ...candidateIds]).size;
	return matchCount / unionSize;
}

/**
 * Score secondary muscle overlap between two exercises.
 * Uses Jaccard similarity on secondary muscle sets.
 */
export function scoreSecondaryMuscles(
	source: ExerciseData['muscles'],
	candidate: ExerciseData['muscles']
): number {
	const sourceSecondary = source.filter((m) => m.activationType === 'secondary');
	const candidateSecondary = candidate.filter((m) => m.activationType === 'secondary');

	if (sourceSecondary.length === 0 && candidateSecondary.length === 0) return 1;
	if (sourceSecondary.length === 0 || candidateSecondary.length === 0) return 0;

	const sourceIds = new Set(sourceSecondary.map((m) => m.muscleId));
	const candidateIds = new Set(candidateSecondary.map((m) => m.muscleId));

	let matchCount = 0;
	for (const id of sourceIds) {
		if (candidateIds.has(id)) matchCount++;
	}

	const unionSize = new Set([...sourceIds, ...candidateIds]).size;
	return matchCount / unionSize;
}

/**
 * Score movement pattern similarity.
 * Exact match = 1.0, same family = 0.5, different = 0.0.
 */
export function scoreMovementPattern(source: string | null, candidate: string | null): number {
	if (!source || !candidate) return 0;
	if (source === candidate) return 1;

	const sourceFamily = MOVEMENT_FAMILIES[source];
	const candidateFamily = MOVEMENT_FAMILIES[candidate];

	if (sourceFamily && sourceFamily === candidateFamily) return 0.5;

	return 0;
}

/**
 * Score force profile match. Exact = 1.0, different = 0.0.
 */
export function scoreForceProfile(source: string | null, candidate: string | null): number {
	if (!source || !candidate) return 0;
	return source === candidate ? 1 : 0;
}

/**
 * Score stretch position match. Exact = 1.0, different = 0.0.
 */
export function scoreStretchPosition(source: string | null, candidate: string | null): number {
	if (!source || !candidate) return 0;
	return source === candidate ? 1 : 0;
}

/**
 * Calculate total similarity score using weighted components.
 */
export function calculateSimilarity(scores: {
	primaryMuscle: number;
	secondaryMuscle: number;
	movementPattern: number;
	forceProfile: number;
	stretchPosition: number;
}): number {
	const total =
		scores.primaryMuscle * WEIGHTS.primaryMuscle +
		scores.secondaryMuscle * WEIGHTS.secondaryMuscle +
		scores.movementPattern * WEIGHTS.movementPattern +
		scores.forceProfile * WEIGHTS.forceProfile +
		scores.stretchPosition * WEIGHTS.stretchPosition;

	return Math.round(total * 100) / 100;
}

/**
 * Generate human-readable match reasons based on scores.
 */
export function generateMatchReasons(
	scores: {
		primaryMuscle: number;
		secondaryMuscle: number;
		movementPattern: number;
		forceProfile: number;
		stretchPosition: number;
	},
	source: ExerciseData
): string[] {
	const reasons: string[] = [];

	if (scores.primaryMuscle > 0) {
		const primaryName = source.muscles.find((m) => m.activationType === 'primary')?.muscleName;
		reasons.push(primaryName ? `Same primary muscle (${primaryName})` : 'Shared primary muscle');
	}

	if (scores.secondaryMuscle >= 0.5) {
		reasons.push('Similar secondary muscle activation');
	}

	if (scores.movementPattern === 1) {
		reasons.push('Same movement pattern');
	} else if (scores.movementPattern === 0.5) {
		reasons.push('Related movement pattern');
	}

	if (scores.forceProfile === 1) {
		reasons.push(`Same force profile (${source.forceProfile})`);
	}

	if (scores.stretchPosition === 1) {
		const pos =
			source.stretchPosition === 'lengthened'
				? 'Lengthened stretch position'
				: source.stretchPosition === 'shortened'
					? 'Shortened stretch position'
					: 'Mid-range loading';
		reasons.push(pos);
	}

	return reasons;
}

// ============ DIFFICULTY COMPARISON ============

const DIFFICULTY_ORDER: Record<string, number> = {
	beginner: 0,
	intermediate: 1,
	advanced: 2
};

function matchesDifficulty(
	source: string | null,
	candidate: string | null,
	filter: 'same' | 'easier' | 'harder' | 'any'
): boolean {
	if (filter === 'any') return true;
	if (!source || !candidate) return true;

	const sourceLevel = DIFFICULTY_ORDER[source];
	const candidateLevel = DIFFICULTY_ORDER[candidate];

	if (sourceLevel === undefined || candidateLevel === undefined) return true;

	switch (filter) {
		case 'same':
			return candidateLevel === sourceLevel;
		case 'easier':
			return candidateLevel <= sourceLevel;
		case 'harder':
			return candidateLevel >= sourceLevel;
		default:
			return true;
	}
}

// ============ DATABASE QUERIES ============

async function fetchExerciseWithDetails(exerciseId: number): Promise<ExerciseData | null> {
	const [exerciseRow] = await db.select().from(exercise).where(eq(exercise.id, exerciseId));

	if (!exerciseRow) return null;

	const muscles = await db
		.select({
			muscleId: exerciseMuscle.muscleId,
			muscleName: muscle.name,
			activationType: exerciseMuscle.activationType,
			weighting: exerciseMuscle.weighting
		})
		.from(exerciseMuscle)
		.innerJoin(muscle, eq(exerciseMuscle.muscleId, muscle.id))
		.where(eq(exerciseMuscle.exerciseId, exerciseId));

	const equip = await db
		.select({
			id: equipment.id,
			name: equipment.name
		})
		.from(exerciseEquipment)
		.innerJoin(equipment, eq(exerciseEquipment.equipmentId, equipment.id))
		.where(eq(exerciseEquipment.exerciseId, exerciseId));

	return {
		id: exerciseRow.id,
		name: exerciseRow.name,
		difficulty: exerciseRow.difficulty,
		movementPattern: exerciseRow.movementPattern,
		forceProfile: exerciseRow.forceProfile,
		stretchPosition: exerciseRow.stretchPosition,
		muscles,
		equipment: equip.map((e) => ({ id: e.id, name: e.name ?? '' }))
	};
}

async function fetchAllCandidates(excludeId: number): Promise<ExerciseData[]> {
	// Fetch all exercises except the source
	const exercises = await db.select().from(exercise).where(ne(exercise.id, excludeId));

	// Fetch all muscle activations in one query
	const allMuscles = await db
		.select({
			exerciseId: exerciseMuscle.exerciseId,
			muscleId: exerciseMuscle.muscleId,
			muscleName: muscle.name,
			activationType: exerciseMuscle.activationType,
			weighting: exerciseMuscle.weighting
		})
		.from(exerciseMuscle)
		.innerJoin(muscle, eq(exerciseMuscle.muscleId, muscle.id));

	// Fetch all equipment in one query
	const allEquipment = await db
		.select({
			exerciseId: exerciseEquipment.exerciseId,
			id: equipment.id,
			name: equipment.name
		})
		.from(exerciseEquipment)
		.innerJoin(equipment, eq(exerciseEquipment.equipmentId, equipment.id));

	// Build lookup maps
	const musclesByExercise = new Map<number, ExerciseData['muscles']>();
	for (const m of allMuscles) {
		if (!musclesByExercise.has(m.exerciseId)) {
			musclesByExercise.set(m.exerciseId, []);
		}
		musclesByExercise.get(m.exerciseId)!.push({
			muscleId: m.muscleId,
			muscleName: m.muscleName,
			activationType: m.activationType,
			weighting: m.weighting
		});
	}

	const equipByExercise = new Map<number, { id: number; name: string }[]>();
	for (const e of allEquipment) {
		if (!equipByExercise.has(e.exerciseId)) {
			equipByExercise.set(e.exerciseId, []);
		}
		equipByExercise.get(e.exerciseId)!.push({ id: e.id, name: e.name ?? '' });
	}

	return exercises.map((ex) => ({
		id: ex.id,
		name: ex.name,
		difficulty: ex.difficulty,
		movementPattern: ex.movementPattern,
		forceProfile: ex.forceProfile,
		stretchPosition: ex.stretchPosition,
		muscles: musclesByExercise.get(ex.id) ?? [],
		equipment: equipByExercise.get(ex.id) ?? []
	}));
}

// ============ MAIN FUNCTION ============

export async function findAlternatives(
	exerciseId: number,
	filters: AlternativeFilters = {}
): Promise<AlternativesResult | null> {
	const {
		availableEquipmentIds,
		difficulty = 'any',
		excludeExerciseIds = [],
		minSimilarity = 0.5,
		limit = 10
	} = filters;

	// Fetch source exercise
	const source = await fetchExerciseWithDetails(exerciseId);
	if (!source) return null;

	// Fetch all candidates
	const candidates = await fetchAllCandidates(exerciseId);

	const sourcePrimaryMuscle =
		source.muscles.find((m) => m.activationType === 'primary')?.muscleName ?? null;

	// Score and filter
	const scored: AlternativeExercise[] = [];

	for (const candidate of candidates) {
		// Apply exclusion filter
		if (excludeExerciseIds.includes(candidate.id)) continue;

		// Apply difficulty filter
		if (!matchesDifficulty(source.difficulty, candidate.difficulty, difficulty)) continue;

		// Apply equipment filter
		if (availableEquipmentIds && availableEquipmentIds.length > 0) {
			const candidateEquipIds = new Set(candidate.equipment.map((e) => e.id));
			const hasRequiredEquipment =
				candidate.equipment.length === 0 ||
				[...candidateEquipIds].every((id) => availableEquipmentIds.includes(id));
			if (!hasRequiredEquipment) continue;
		}

		// Calculate scores
		const scores = {
			primaryMuscle: scorePrimaryMuscles(source.muscles, candidate.muscles),
			secondaryMuscle: scoreSecondaryMuscles(source.muscles, candidate.muscles),
			movementPattern: scoreMovementPattern(source.movementPattern, candidate.movementPattern),
			forceProfile: scoreForceProfile(source.forceProfile, candidate.forceProfile),
			stretchPosition: scoreStretchPosition(source.stretchPosition, candidate.stretchPosition)
		};

		const similarity = calculateSimilarity(scores);

		if (similarity < minSimilarity) continue;

		const matchReasons = generateMatchReasons(scores, source);
		const candidatePrimaryMuscle =
			candidate.muscles.find((m) => m.activationType === 'primary')?.muscleName ?? null;

		scored.push({
			exerciseId: candidate.id,
			name: candidate.name,
			similarity,
			matchReasons,
			difficulty: candidate.difficulty,
			movementPattern: candidate.movementPattern,
			primaryMuscle: candidatePrimaryMuscle,
			equipment: candidate.equipment
		});
	}

	// Sort by similarity descending
	scored.sort((a, b) => b.similarity - a.similarity);

	return {
		sourceExercise: {
			id: source.id,
			name: source.name,
			primaryMuscle: sourcePrimaryMuscle,
			movementPattern: source.movementPattern
		},
		alternatives: scored.slice(0, limit),
		totalCandidates: candidates.length
	};
}
