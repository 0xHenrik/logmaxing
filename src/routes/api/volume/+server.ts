/**
 * @fileoverview Volume Calculation REST API Endpoint
 *
 * POST /api/volume - Calculate training volume per muscle with zone status.
 *
 * @description
 * This endpoint accepts workout data and returns volume calculations for each
 * muscle, indicating whether the training volume is under/optimal/over based
 * on science-backed thresholds (MEV/MRV).
 *
 * @example Request with exercise-based input
 * ```bash
 * curl -X POST /api/volume \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "exercises": [
 *       { "exerciseId": 1, "sets": 4 },
 *       { "exerciseId": 12, "sets": 3 }
 *     ]
 *   }'
 * ```
 *
 * @example Request with direct muscle input
 * ```bash
 * curl -X POST /api/volume \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "directVolume": [
 *       { "muscleId": 1, "sets": 12 },
 *       { "muscleId": 3, "sets": 8 }
 *     ]
 *   }'
 * ```
 *
 * @example Response
 * ```json
 * {
 *   "muscles": [
 *     {
 *       "muscleId": 1,
 *       "muscleName": "Chest",
 *       "effectiveSets": 8,
 *       "zone": "under",
 *       "thresholds": { "mev": 10, "mavMin": 12, "mavMax": 18, "mrv": 22 }
 *     }
 *   ],
 *   "summary": {
 *     "totalMuscles": 1,
 *     "under": ["Chest"],
 *     "optimal": [],
 *     "over": []
 *   }
 * }
 * ```
 *
 * @module api/volume
 */

import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { requireJson } from '$lib/server/api/validation';
import { exercise, exerciseMuscle } from '$lib/server/db/schema';
import { calculateVolume, getMusclesWithThresholds } from '$lib/server/api/volume';

// ============ VALIDATION SCHEMAS ============

/**
 * Schema for exercise-based input.
 * @property {number} exerciseId - Database ID of the exercise (min: 1)
 * @property {number} sets - Number of sets performed (min: 1, max: 50)
 */
const exerciseInputSchema = v.object({
	exerciseId: v.pipe(v.number(), v.integer(), v.minValue(1)),
	sets: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50))
});

/**
 * Schema for direct muscle input.
 * @property {number} muscleId - Database ID of the muscle (min: 1)
 * @property {number} sets - Number of direct sets (min: 1, max: 100)
 */
const directVolumeInputSchema = v.object({
	muscleId: v.pipe(v.number(), v.integer(), v.minValue(1)),
	sets: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100))
});

/**
 * Schema for the volume calculation request.
 * At least one of `exercises` or `directVolume` must be provided.
 */
const volumeRequestSchema = v.object({
	exercises: v.optional(v.pipe(v.array(exerciseInputSchema), v.maxLength(50))),
	directVolume: v.optional(v.pipe(v.array(directVolumeInputSchema), v.maxLength(25)))
});

/**
 * Validates the request body and ensures at least one input type is provided.
 *
 * @param data - Raw request body (unknown type)
 * @returns Validated and typed request object
 * @throws {v.ValiError} If validation fails
 * @throws {Error} If neither exercises nor directVolume is provided
 */
function validateRequest(data: unknown) {
	const parsed = v.parse(volumeRequestSchema, data);

	const hasExercises = parsed.exercises && parsed.exercises.length > 0;
	const hasDirectVolume = parsed.directVolume && parsed.directVolume.length > 0;

	if (!hasExercises && !hasDirectVolume) {
		throw new Error('At least one of "exercises" or "directVolume" must be provided');
	}

	return parsed;
}

// ============ HANDLERS ============

/**
 * POST /api/volume - Calculate training volume per muscle.
 *
 * @param request.body.exercises - Exercise-based input (uses activation weighting)
 * @param request.body.exercises[].exerciseId - Database ID of the exercise
 * @param request.body.exercises[].sets - Number of sets performed (1-50)
 * @param request.body.directVolume - Direct muscle input (bypasses exercise lookup)
 * @param request.body.directVolume[].muscleId - Database ID of the muscle
 * @param request.body.directVolume[].sets - Number of direct sets (1-100)
 *
 * @returns {200} Volume calculation result with muscles array and summary
 * @returns {400} Validation error or missing input
 * @returns {500} Internal server error
 */
/**
 * GET /api/volume - Returns available muscle and exercise IDs for testing.
 * This is a helper endpoint to discover valid IDs in your database.
 */
export const GET: RequestHandler = async () => {
	const musclesMap = await getMusclesWithThresholds();
	const muscles = Array.from(musclesMap.entries()).map(([id, data]) => ({
		id,
		name: data.name,
		mev: data.thresholds.mev,
		mrv: data.thresholds.mrv
	}));

	// Get first 10 exercises with their muscle mappings
	const exercisesWithMuscles = await db
		.select({
			exerciseId: exercise.id,
			exerciseName: exercise.name,
			muscleId: exerciseMuscle.muscleId,
			weighting: exerciseMuscle.weighting
		})
		.from(exercise)
		.innerJoin(exerciseMuscle, eq(exercise.id, exerciseMuscle.exerciseId))
		.limit(30);

	// Group by exercise
	const exerciseMap = new Map<
		number,
		{ name: string; muscles: { muscleId: number; weighting: number | null }[] }
	>();
	for (const row of exercisesWithMuscles) {
		if (!exerciseMap.has(row.exerciseId)) {
			exerciseMap.set(row.exerciseId, { name: row.exerciseName, muscles: [] });
		}
		exerciseMap
			.get(row.exerciseId)!
			.muscles.push({ muscleId: row.muscleId, weighting: row.weighting });
	}

	const sampleExercises = Array.from(exerciseMap.entries())
		.slice(0, 5)
		.map(([id, data]) => ({
			id,
			name: data.name,
			muscles: data.muscles
		}));

	return Response.json({
		muscles,
		sampleExercises,
		hint: 'Use these IDs in your POST request'
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const ctError = requireJson(request);
	if (ctError) return ctError;

	try {
		const json = await request.json();
		const validatedRequest = validateRequest(json);
		const result = await calculateVolume(validatedRequest);
		return Response.json(result);
	} catch (error) {
		if (error instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: error.issues }, { status: 400 });
		}
		if (error instanceof Error) {
			return Response.json({ error: error.message }, { status: 400 });
		}
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
};
