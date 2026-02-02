import { eq } from 'drizzle-orm';

import { db } from '../db';
import { type Muscle, muscle } from '../db/schema';

export async function getMuscles(): Promise<Muscle[]> {
	return db.select().from(muscle);
}

export async function getMuscle(id: number): Promise<Muscle | null> {
	const [result] = await db.select().from(muscle).where(eq(muscle.id, id));
	return result ?? null;
}

export async function insertMuscle(data: Omit<Muscle, 'id'>): Promise<Muscle> {
	const [created] = await db.insert(muscle).values(data).returning();
	return created;
}

export async function updateMuscle(id: number, data: Partial<Omit<Muscle, 'id'>>): Promise<void> {
	await db.update(muscle).set(data).where(eq(muscle.id, id));
}

export async function deleteMuscle(id: number): Promise<{ deletedId: number } | null> {
	const [row] = await db
		.delete(muscle)
		.where(eq(muscle.id, id))
		.returning({ deletedId: muscle.id });

	return row ?? null;
}
