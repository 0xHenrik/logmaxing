import { eq } from 'drizzle-orm';

import { db } from '../db';
import {
	type Muscle,
	type MuscleVolumeThreshold,
	muscle,
	muscleVolumeThreshold
} from '../db/schema';

type MuscleWithVolume = Muscle & {
	volumeThreshold: MuscleVolumeThreshold | null;
};

export async function getMuscles(): Promise<MuscleWithVolume[]> {
	const results = await db
		.select()
		.from(muscle)
		.leftJoin(muscleVolumeThreshold, eq(muscle.id, muscleVolumeThreshold.muscleId));

	return results.map((r) => ({
		...r.muscle,
		volumeThreshold: r.muscle_volume_threshold
	}));
}

export const updateMuscle = async (id: number, data: MuscleWithVolume) => {
	const { name, muscleGroup, volumeThreshold } = data;

	const batchResponse = await db.batch([
		db.update(muscle).set({ name, muscleGroup }).where(eq(muscle.id, id)),
		db
			.update(muscleVolumeThreshold)
			.set({ ...volumeThreshold })
			.where(eq(muscleVolumeThreshold.muscleId, id))
	]);
	return batchResponse;
};

export const getMuscle = async (id: number): Promise<MuscleWithVolume[]> => {
	const result = await db
		.select()
		.from(muscle)
		.leftJoin(muscleVolumeThreshold, eq(muscle.id, muscleVolumeThreshold.muscleId))
		.where(eq(muscle.id, id));

	return result.map((r) => ({
		...r.muscle,
		volumeThreshold: r.muscle_volume_threshold
	}));
};

export const insertMuscle = async (data: MuscleWithVolume) => {
	const { name, muscleGroup, volumeThreshold } = data;

	const [newMuscle] = await db.insert(muscle).values({ name, muscleGroup }).returning();

	await db.insert(muscleVolumeThreshold).values({
		muscleId: newMuscle.id,
		...volumeThreshold
	});
};

export const deleteMuscle = async (id: number) => {
	const [row] = await db
		.delete(muscle)
		.where(eq(muscle.id, id))
		.returning({ deletedId: muscle.id });

	return row ?? null;
};
