// schema.ts
import { type InferSelectModel, relations } from 'drizzle-orm';
import { text, real, unique, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// Users
export const userProfile = sqliteTable('user_profile', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	fitnessLevel: integer('fitness_level'),
	age: integer('age'),
	sex: text('sex')
});

// Muscles
export const muscle = sqliteTable('muscle', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	muscleGroup: text('muscle_group')
});

export const muscleVolumeThreshold = sqliteTable('muscle_volume_threshold', {
	muscleId: integer('muscle_id')
		.primaryKey()
		.references(() => muscle.id, { onDelete: 'cascade' }),
	mv: integer('mv'),
	mev: integer('mev'),
	mavMin: integer('mav_min'),
	mavMax: integer('mav_max'),
	mrv: integer('mrv')
});

// Equipment
export const equipment = sqliteTable('equipment', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name')
});

// Exercises
export const exercise = sqliteTable('exercise', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

// Exercise ↔ Muscle (many-to-many with attributes)
export const exerciseMuscle = sqliteTable(
	'exercise_muscle',
	{
		exerciseId: integer('exercise_id')
			.notNull()
			.references(() => exercise.id, { onDelete: 'cascade' }),
		muscleId: integer('muscle_id')
			.notNull()
			.references(() => muscle.id, { onDelete: 'cascade' }),
		activationType: text('activation_type'),
		weighting: real('weighting')
	},
	(table) => [unique().on(table.exerciseId, table.muscleId)]
);

// Exercise ↔ Equipment (many-to-many)
export const exerciseEquipment = sqliteTable(
	'exercise_equipment',
	{
		exerciseId: integer('exercise_id')
			.notNull()
			.references(() => exercise.id, { onDelete: 'cascade' }),
		equipmentId: integer('equipment_id')
			.notNull()
			.references(() => equipment.id, { onDelete: 'cascade' })
	},
	(table) => [unique().on(table.exerciseId, table.equipmentId)]
);

// Programs
export const program = sqliteTable('program', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	userId: integer('user_id').references(() => userProfile.id, { onDelete: 'set null' }),
	description: text('description'),
	startDate: text('start_date'),
	endDate: text('end_date')
});

// Blocks (within programs)
export const block = sqliteTable('block', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	programId: integer('program_id')
		.notNull()
		.references(() => program.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	sequence: integer('sequence'),
	durationWeeks: integer('duration_weeks')
});

// Days within a block
export const blockDay = sqliteTable('block_day', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	blockId: integer('block_id')
		.notNull()
		.references(() => block.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	sequence: integer('sequence')
});

// Workouts
export const workout = sqliteTable('workout', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	blockDayId: integer('block_day_id')
		.notNull()
		.references(() => blockDay.id, { onDelete: 'cascade' }),
	name: text('name'),
	notes: text('notes'),
	sequence: integer('sequence')
});

// Exercises inside a workout
export const workoutExercise = sqliteTable('workout_exercise', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	workoutId: integer('workout_id')
		.notNull()
		.references(() => workout.id, { onDelete: 'cascade' }),
	exerciseId: integer('exercise_id')
		.notNull()
		.references(() => exercise.id, { onDelete: 'cascade' }),
	sets: integer('sets'),
	reps: text('reps'),
	weight: real('weight'),
	restSeconds: integer('rest_seconds'),
	notes: text('notes'),
	sequence: integer('sequence'),
	groupName: text('group_name')
});

// Workout logging
export const workoutLog = sqliteTable('workout_log', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	workoutExerciseId: integer('workout_exercise_id')
		.notNull()
		.references(() => workoutExercise.id, { onDelete: 'cascade' }),
	performedSets: integer('performed_sets'),
	performedReps: text('performed_reps'),
	performedWeight: real('performed_weight'),
	date: text('date'),
	notes: text('notes')
});

// User check-ins
export const userCheckin = sqliteTable('user_checkin', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => userProfile.id, { onDelete: 'cascade' }),
	date: text('date'),
	weight: real('weight'),
	waist: real('waist'),
	chest: real('chest'),
	hips: real('hips'),
	steps: integer('steps'),
	bodyFat: real('body_fat'),
	notes: text('notes')
});

// ============ RELATIONS ============

export const userProfileRelations = relations(userProfile, ({ many }) => ({
	programs: many(program),
	checkins: many(userCheckin)
}));

export const muscleRelations = relations(muscle, ({ one, many }) => ({
	volumeThreshold: one(muscleVolumeThreshold, {
		fields: [muscle.id],
		references: [muscleVolumeThreshold.muscleId]
	}),
	exerciseMuscles: many(exerciseMuscle)
}));

export const exerciseRelations = relations(exercise, ({ many }) => ({
	exerciseMuscles: many(exerciseMuscle),
	exerciseEquipment: many(exerciseEquipment),
	workoutExercises: many(workoutExercise)
}));

export const equipmentRelations = relations(equipment, ({ many }) => ({
	exerciseEquipment: many(exerciseEquipment)
}));

export const programRelations = relations(program, ({ one, many }) => ({
	user: one(userProfile, {
		fields: [program.userId],
		references: [userProfile.id]
	}),
	blocks: many(block)
}));

export const blockRelations = relations(block, ({ one, many }) => ({
	program: one(program, {
		fields: [block.programId],
		references: [program.id]
	}),
	days: many(blockDay)
}));

export const blockDayRelations = relations(blockDay, ({ one, many }) => ({
	block: one(block, {
		fields: [blockDay.blockId],
		references: [block.id]
	}),
	workouts: many(workout)
}));

export const workoutRelations = relations(workout, ({ one, many }) => ({
	blockDay: one(blockDay, {
		fields: [workout.blockDayId],
		references: [blockDay.id]
	}),
	exercises: many(workoutExercise)
}));

export const workoutExerciseRelations = relations(workoutExercise, ({ one, many }) => ({
	workout: one(workout, {
		fields: [workoutExercise.workoutId],
		references: [workout.id]
	}),
	exercise: one(exercise, {
		fields: [workoutExercise.exerciseId],
		references: [exercise.id]
	}),
	logs: many(workoutLog)
}));

export const workoutLogRelations = relations(workoutLog, ({ one }) => ({
	workoutExercise: one(workoutExercise, {
		fields: [workoutLog.workoutExerciseId],
		references: [workoutExercise.id]
	})
}));

export const exerciseMuscleRelations = relations(exerciseMuscle, ({ one }) => ({
	exercise: one(exercise, {
		fields: [exerciseMuscle.exerciseId],
		references: [exercise.id]
	}),
	muscle: one(muscle, {
		fields: [exerciseMuscle.muscleId],
		references: [muscle.id]
	})
}));

export const exerciseEquipmentRelations = relations(exerciseEquipment, ({ one }) => ({
	exercise: one(exercise, {
		fields: [exerciseEquipment.exerciseId],
		references: [exercise.id]
	}),
	equipment: one(equipment, {
		fields: [exerciseEquipment.equipmentId],
		references: [equipment.id]
	})
}));

export const userCheckinRelations = relations(userCheckin, ({ one }) => ({
	user: one(userProfile, {
		fields: [userCheckin.userId],
		references: [userProfile.id]
	})
}));

// Export inferreda types

export type Muscle = InferSelectModel<typeof muscle>;
export type MuscleVolumeThreshold = InferSelectModel<typeof muscleVolumeThreshold>;
