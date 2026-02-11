import { eq, and } from 'drizzle-orm';

import { db } from '../db';
import {
	type Block,
	type Program,
	type Workout,
	type BlockDay,
	type WorkoutExercise,
	block,
	program,
	workout,
	blockDay,
	workoutExercise
} from '../db/schema';

// ============ OWNERSHIP VERIFICATION ============

export async function verifyProgramOwnership(
	programId: number,
	userId: number
): Promise<Program | null> {
	const [result] = await db
		.select()
		.from(program)
		.where(and(eq(program.id, programId), eq(program.userId, userId)));
	return result ?? null;
}

export async function verifyBlockOwnership(blockId: number, userId: number): Promise<Block | null> {
	const [result] = await db
		.select({ block })
		.from(block)
		.innerJoin(program, eq(block.programId, program.id))
		.where(and(eq(block.id, blockId), eq(program.userId, userId)));
	return result?.block ?? null;
}

export async function verifyDayOwnership(dayId: number, userId: number): Promise<BlockDay | null> {
	const [result] = await db
		.select({ blockDay })
		.from(blockDay)
		.innerJoin(block, eq(blockDay.blockId, block.id))
		.innerJoin(program, eq(block.programId, program.id))
		.where(and(eq(blockDay.id, dayId), eq(program.userId, userId)));
	return result?.blockDay ?? null;
}

export async function verifyWorkoutOwnership(
	workoutId: number,
	userId: number
): Promise<Workout | null> {
	const [result] = await db
		.select({ workout })
		.from(workout)
		.innerJoin(blockDay, eq(workout.blockDayId, blockDay.id))
		.innerJoin(block, eq(blockDay.blockId, block.id))
		.innerJoin(program, eq(block.programId, program.id))
		.where(and(eq(workout.id, workoutId), eq(program.userId, userId)));
	return result?.workout ?? null;
}

export async function verifyWorkoutExerciseOwnership(
	workoutExerciseId: number,
	userId: number
): Promise<WorkoutExercise | null> {
	const [result] = await db
		.select({ workoutExercise })
		.from(workoutExercise)
		.innerJoin(workout, eq(workoutExercise.workoutId, workout.id))
		.innerJoin(blockDay, eq(workout.blockDayId, blockDay.id))
		.innerJoin(block, eq(blockDay.blockId, block.id))
		.innerJoin(program, eq(block.programId, program.id))
		.where(and(eq(workoutExercise.id, workoutExerciseId), eq(program.userId, userId)));
	return result?.workoutExercise ?? null;
}

// ============ PROGRAM CRUD ============

export async function getPrograms(userId: number, limit = 50, offset = 0): Promise<Program[]> {
	return db
		.select()
		.from(program)
		.where(eq(program.userId, userId))
		.orderBy(program.id)
		.limit(limit)
		.offset(offset);
}

export interface ProgramFull extends Program {
	blocks: (Block & {
		days: (BlockDay & {
			workouts: (Workout & {
				exercises: WorkoutExercise[];
			})[];
		})[];
	})[];
}

export async function getProgramFull(id: number, userId: number): Promise<ProgramFull | null> {
	const result = await db.query.program.findFirst({
		where: and(eq(program.id, id), eq(program.userId, userId)),
		with: {
			blocks: {
				orderBy: (b, { asc }) => [asc(b.sequence)],
				with: {
					days: {
						orderBy: (d, { asc }) => [asc(d.sequence)],
						with: {
							workouts: {
								orderBy: (w, { asc }) => [asc(w.sequence)],
								with: {
									exercises: {
										orderBy: (e, { asc }) => [asc(e.sequence)]
									}
								}
							}
						}
					}
				}
			}
		}
	});
	return (result as ProgramFull) ?? null;
}

export interface InsertProgramInput {
	name: string;
	description?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	blocks?: {
		name: string;
		description?: string | null;
		sequence?: number | null;
		durationWeeks?: number | null;
		days?: {
			name: string;
			sequence?: number | null;
			workouts?: {
				name?: string | null;
				notes?: string | null;
				sequence?: number | null;
				exercises?: {
					exerciseId: number;
					sets?: number | null;
					reps?: string | null;
					weight?: number | null;
					restSeconds?: number | null;
					notes?: string | null;
					sequence?: number | null;
					groupName?: string | null;
				}[];
			}[];
		}[];
	}[];
}

export async function insertProgram(data: InsertProgramInput, userId: number): Promise<Program> {
	if (!data.blocks?.length) {
		const [created] = await db
			.insert(program)
			.values({
				name: data.name,
				userId,
				description: data.description ?? null,
				startDate: data.startDate ?? null,
				endDate: data.endDate ?? null
			})
			.returning();
		return created;
	}

	return db.transaction(async (tx) => {
		const [created] = await tx
			.insert(program)
			.values({
				name: data.name,
				userId,
				description: data.description ?? null,
				startDate: data.startDate ?? null,
				endDate: data.endDate ?? null
			})
			.returning();

		for (const b of data.blocks!) {
			const [createdBlock] = await tx
				.insert(block)
				.values({
					programId: created.id,
					name: b.name,
					description: b.description ?? null,
					sequence: b.sequence ?? null,
					durationWeeks: b.durationWeeks ?? null
				})
				.returning();

			if (b.days) {
				for (const d of b.days) {
					const [createdDay] = await tx
						.insert(blockDay)
						.values({
							blockId: createdBlock.id,
							name: d.name,
							sequence: d.sequence ?? null
						})
						.returning();

					if (d.workouts) {
						for (const w of d.workouts) {
							const [createdWorkout] = await tx
								.insert(workout)
								.values({
									blockDayId: createdDay.id,
									name: w.name ?? null,
									notes: w.notes ?? null,
									sequence: w.sequence ?? null
								})
								.returning();

							if (w.exercises?.length) {
								await tx.insert(workoutExercise).values(
									w.exercises.map((e) => ({
										workoutId: createdWorkout.id,
										exerciseId: e.exerciseId,
										sets: e.sets ?? null,
										reps: e.reps ?? null,
										weight: e.weight ?? null,
										restSeconds: e.restSeconds ?? null,
										notes: e.notes ?? null,
										sequence: e.sequence ?? null,
										groupName: e.groupName ?? null
									}))
								);
							}
						}
					}
				}
			}
		}

		return created;
	});
}

export async function updateProgram(
	id: number,
	userId: number,
	data: Partial<Omit<Program, 'id' | 'userId'>>
): Promise<boolean> {
	const owned = await verifyProgramOwnership(id, userId);
	if (!owned) return false;

	await db.update(program).set(data).where(eq(program.id, id));
	return true;
}

export async function deleteProgram(id: number, userId: number): Promise<boolean> {
	const owned = await verifyProgramOwnership(id, userId);
	if (!owned) return false;

	const [row] = await db
		.delete(program)
		.where(eq(program.id, id))
		.returning({ deletedId: program.id });
	return !!row;
}

// ============ BLOCK CRUD ============

export async function insertBlock(
	programId: number,
	userId: number,
	data: {
		name: string;
		description?: string | null;
		sequence?: number | null;
		durationWeeks?: number | null;
	}
): Promise<Block | null> {
	const owned = await verifyProgramOwnership(programId, userId);
	if (!owned) return null;

	const [created] = await db
		.insert(block)
		.values({
			programId,
			name: data.name,
			description: data.description ?? null,
			sequence: data.sequence ?? null,
			durationWeeks: data.durationWeeks ?? null
		})
		.returning();
	return created;
}

export async function updateBlock(
	id: number,
	userId: number,
	data: Partial<Omit<Block, 'id' | 'programId'>>
): Promise<boolean> {
	const owned = await verifyBlockOwnership(id, userId);
	if (!owned) return false;

	await db.update(block).set(data).where(eq(block.id, id));
	return true;
}

export async function deleteBlock(id: number, userId: number): Promise<boolean> {
	const owned = await verifyBlockOwnership(id, userId);
	if (!owned) return false;

	const [row] = await db.delete(block).where(eq(block.id, id)).returning({ deletedId: block.id });
	return !!row;
}

// ============ BLOCK DAY CRUD ============

export async function insertDay(
	blockId: number,
	userId: number,
	data: { name: string; sequence?: number | null }
): Promise<BlockDay | null> {
	const owned = await verifyBlockOwnership(blockId, userId);
	if (!owned) return null;

	const [created] = await db
		.insert(blockDay)
		.values({
			blockId,
			name: data.name,
			sequence: data.sequence ?? null
		})
		.returning();
	return created;
}

export async function updateDay(
	id: number,
	userId: number,
	data: Partial<Omit<BlockDay, 'id' | 'blockId'>>
): Promise<boolean> {
	const owned = await verifyDayOwnership(id, userId);
	if (!owned) return false;

	await db.update(blockDay).set(data).where(eq(blockDay.id, id));
	return true;
}

export async function deleteDay(id: number, userId: number): Promise<boolean> {
	const owned = await verifyDayOwnership(id, userId);
	if (!owned) return false;

	const [row] = await db
		.delete(blockDay)
		.where(eq(blockDay.id, id))
		.returning({ deletedId: blockDay.id });
	return !!row;
}

// ============ WORKOUT CRUD ============

export async function insertWorkout(
	blockDayId: number,
	userId: number,
	data: { name?: string | null; notes?: string | null; sequence?: number | null }
): Promise<Workout | null> {
	const owned = await verifyDayOwnership(blockDayId, userId);
	if (!owned) return null;

	const [created] = await db
		.insert(workout)
		.values({
			blockDayId,
			name: data.name ?? null,
			notes: data.notes ?? null,
			sequence: data.sequence ?? null
		})
		.returning();
	return created;
}

export async function updateWorkout(
	id: number,
	userId: number,
	data: Partial<Omit<Workout, 'id' | 'blockDayId'>>
): Promise<boolean> {
	const owned = await verifyWorkoutOwnership(id, userId);
	if (!owned) return false;

	await db.update(workout).set(data).where(eq(workout.id, id));
	return true;
}

export async function deleteWorkout(id: number, userId: number): Promise<boolean> {
	const owned = await verifyWorkoutOwnership(id, userId);
	if (!owned) return false;

	const [row] = await db
		.delete(workout)
		.where(eq(workout.id, id))
		.returning({ deletedId: workout.id });
	return !!row;
}

// ============ WORKOUT EXERCISE CRUD ============

export async function insertWorkoutExercise(
	workoutId: number,
	userId: number,
	data: {
		exerciseId: number;
		sets?: number | null;
		reps?: string | null;
		weight?: number | null;
		restSeconds?: number | null;
		notes?: string | null;
		sequence?: number | null;
		groupName?: string | null;
	}
): Promise<WorkoutExercise | null> {
	const owned = await verifyWorkoutOwnership(workoutId, userId);
	if (!owned) return null;

	const [created] = await db
		.insert(workoutExercise)
		.values({
			workoutId,
			exerciseId: data.exerciseId,
			sets: data.sets ?? null,
			reps: data.reps ?? null,
			weight: data.weight ?? null,
			restSeconds: data.restSeconds ?? null,
			notes: data.notes ?? null,
			sequence: data.sequence ?? null,
			groupName: data.groupName ?? null
		})
		.returning();
	return created;
}

export async function updateWorkoutExercise(
	id: number,
	userId: number,
	data: Partial<Omit<WorkoutExercise, 'id' | 'workoutId'>>
): Promise<boolean> {
	const owned = await verifyWorkoutExerciseOwnership(id, userId);
	if (!owned) return false;

	await db.update(workoutExercise).set(data).where(eq(workoutExercise.id, id));
	return true;
}

export async function deleteWorkoutExercise(id: number, userId: number): Promise<boolean> {
	const owned = await verifyWorkoutExerciseOwnership(id, userId);
	if (!owned) return false;

	const [row] = await db
		.delete(workoutExercise)
		.where(eq(workoutExercise.id, id))
		.returning({ deletedId: workoutExercise.id });
	return !!row;
}
