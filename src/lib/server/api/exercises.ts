import { eq, and, ilike, inArray, isNotNull } from 'drizzle-orm';

import { db } from '../db';
import {
	type Muscle,
	type Exercise,
	type Equipment,
	type ExerciseMuscle,
	type ExerciseEquipment,
	muscle,
	exercise,
	equipment,
	exerciseMuscle,
	exerciseEquipment
} from '../db/schema';

export type ExerciseWithDetails = Exercise & {
	muscles: (ExerciseMuscle & { muscle: Muscle })[];
	equipment: (ExerciseEquipment & { equipment: Equipment })[];
};

// List view - lightweight, just what's needed for browsing
export type ExerciseListItem = {
	id: number;
	name: string;
	primaryMuscle: string | null;
	muscleGroup: string | null;
	difficulty: string | null;
	movementPattern: string | null;
};

export interface ExerciseFilters {
	search?: string;
	muscleId?: number;
	muscleGroup?: string;
	equipmentId?: number;
	// Biomechanics filters
	difficulty?: string;
	movementPattern?: string;
	forceProfile?: string;
	stretchPosition?: string;
	unilateral?: boolean;
	gripType?: string;
	// Pagination
	limit?: number;
	offset?: number;
}

export async function getExercises(filters: ExerciseFilters = {}): Promise<ExerciseListItem[]> {
	const {
		search,
		muscleId,
		muscleGroup,
		equipmentId,
		difficulty,
		movementPattern,
		forceProfile,
		stretchPosition,
		unilateral,
		gripType,
		limit = 50,
		offset = 0
	} = filters;

	// Build the query with filters
	let query = db
		.select({
			id: exercise.id,
			name: exercise.name,
			primaryMuscle: muscle.name,
			muscleGroup: muscle.muscleGroup,
			difficulty: exercise.difficulty,
			movementPattern: exercise.movementPattern
		})
		.from(exercise)
		.leftJoin(exerciseMuscle, eq(exercise.id, exerciseMuscle.exerciseId))
		.leftJoin(muscle, eq(exerciseMuscle.muscleId, muscle.id))
		.$dynamic();

	const conditions = [];

	// Filter by search term
	if (search) {
		conditions.push(ilike(exercise.name, `%${search}%`));
	}

	// Filter by muscle
	if (muscleId) {
		conditions.push(eq(exerciseMuscle.muscleId, muscleId));
	}

	// Filter by muscle group
	if (muscleGroup) {
		conditions.push(eq(muscle.muscleGroup, muscleGroup));
	}

	// Filter by equipment
	if (equipmentId) {
		const exerciseIds = await db
			.select({ exerciseId: exerciseEquipment.exerciseId })
			.from(exerciseEquipment)
			.where(eq(exerciseEquipment.equipmentId, equipmentId));

		if (exerciseIds.length > 0) {
			conditions.push(
				inArray(
					exercise.id,
					exerciseIds.map((e) => e.exerciseId)
				)
			);
		} else {
			return []; // No exercises match this equipment
		}
	}

	// Biomechanics filters
	if (difficulty) {
		conditions.push(eq(exercise.difficulty, difficulty));
	}

	if (movementPattern) {
		conditions.push(eq(exercise.movementPattern, movementPattern));
	}

	if (forceProfile) {
		conditions.push(eq(exercise.forceProfile, forceProfile));
	}

	if (stretchPosition) {
		conditions.push(eq(exercise.stretchPosition, stretchPosition));
	}

	if (unilateral !== undefined) {
		conditions.push(eq(exercise.unilateral, unilateral));
	}

	if (gripType) {
		conditions.push(eq(exercise.gripType, gripType));
	}

	// Only include primary muscle activations for the list view
	conditions.push(eq(exerciseMuscle.activationType, 'primary'));

	if (conditions.length > 0) {
		query = query.where(and(...conditions));
	}

	const results = await query.limit(limit).offset(offset);

	return results;
}

export async function getExercise(id: number): Promise<ExerciseWithDetails | null> {
	const [exerciseData] = await db.select().from(exercise).where(eq(exercise.id, id));

	if (!exerciseData) {
		return null;
	}

	// Get muscle activations
	const muscles = await db
		.select({
			exerciseId: exerciseMuscle.exerciseId,
			muscleId: exerciseMuscle.muscleId,
			activationType: exerciseMuscle.activationType,
			weighting: exerciseMuscle.weighting,
			muscle: {
				id: muscle.id,
				name: muscle.name,
				muscleGroup: muscle.muscleGroup
			}
		})
		.from(exerciseMuscle)
		.innerJoin(muscle, eq(exerciseMuscle.muscleId, muscle.id))
		.where(eq(exerciseMuscle.exerciseId, id));

	// Get equipment
	const equipmentList = await db
		.select({
			exerciseId: exerciseEquipment.exerciseId,
			equipmentId: exerciseEquipment.equipmentId,
			equipment: {
				id: equipment.id,
				name: equipment.name
			}
		})
		.from(exerciseEquipment)
		.innerJoin(equipment, eq(exerciseEquipment.equipmentId, equipment.id))
		.where(eq(exerciseEquipment.exerciseId, id));

	return {
		...exerciseData,
		muscles: muscles as (ExerciseMuscle & { muscle: Muscle })[],
		equipment: equipmentList as (ExerciseEquipment & { equipment: Equipment })[]
	};
}

export async function searchExercises(query: string, limit = 20): Promise<ExerciseListItem[]> {
	return getExercises({ search: query, limit });
}

export async function getExercisesByMuscle(muscleId: number): Promise<ExerciseListItem[]> {
	return getExercises({ muscleId, limit: 100 });
}

export async function getExercisesByMuscleGroup(muscleGroup: string): Promise<ExerciseListItem[]> {
	return getExercises({ muscleGroup, limit: 100 });
}

export async function getAllEquipment(): Promise<Equipment[]> {
	return db.select().from(equipment);
}

export async function getMuscleGroups(): Promise<string[]> {
	const results = await db
		.selectDistinct({ muscleGroup: muscle.muscleGroup })
		.from(muscle)
		.where(isNotNull(muscle.muscleGroup));

	return results.map((r) => r.muscleGroup).filter((g): g is string => g !== null);
}
