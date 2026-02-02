// schema.ts - PostgreSQL version for Supabase
import { type InferSelectModel, relations } from 'drizzle-orm';
import { text, serial, unique, integer, pgTable, doublePrecision } from 'drizzle-orm/pg-core';

// Users
export const userProfile = pgTable('user_profile', {
	id: serial('id').primaryKey(),
	name: text('name'),
	fitnessLevel: integer('fitness_level'),
	age: integer('age'),
	sex: text('sex')
});

// Muscles (with volume thresholds merged in)
export const muscle = pgTable('muscle', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	muscleGroup: text('muscle_group'),
	// Volume thresholds (sets per week)
	mv: integer('mv'), // Maintenance Volume
	mev: integer('mev'), // Minimum Effective Volume
	mavMin: integer('mav_min'), // Maximum Adaptive Volume (min)
	mavMax: integer('mav_max'), // Maximum Adaptive Volume (max)
	mrv: integer('mrv') // Maximum Recoverable Volume
});

// Equipment
export const equipment = pgTable('equipment', {
	id: serial('id').primaryKey(),
	name: text('name')
});

// Exercises
export const exercise = pgTable('exercise', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique()
});

// Exercise ↔ Muscle (many-to-many with attributes)
export const exerciseMuscle = pgTable(
	'exercise_muscle',
	{
		exerciseId: integer('exercise_id')
			.notNull()
			.references(() => exercise.id, { onDelete: 'cascade' }),
		muscleId: integer('muscle_id')
			.notNull()
			.references(() => muscle.id, { onDelete: 'cascade' }),
		activationType: text('activation_type'),
		weighting: doublePrecision('weighting')
	},
	(table) => [unique().on(table.exerciseId, table.muscleId)]
);

// Exercise ↔ Equipment (many-to-many)
export const exerciseEquipment = pgTable(
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
export const program = pgTable('program', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id').references(() => userProfile.id, { onDelete: 'set null' }),
	description: text('description'),
	startDate: text('start_date'),
	endDate: text('end_date')
});

// Blocks (within programs)
export const block = pgTable('block', {
	id: serial('id').primaryKey(),
	programId: integer('program_id')
		.notNull()
		.references(() => program.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	sequence: integer('sequence'),
	durationWeeks: integer('duration_weeks')
});

// Days within a block
export const blockDay = pgTable('block_day', {
	id: serial('id').primaryKey(),
	blockId: integer('block_id')
		.notNull()
		.references(() => block.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	sequence: integer('sequence')
});

// Workouts
export const workout = pgTable('workout', {
	id: serial('id').primaryKey(),
	blockDayId: integer('block_day_id')
		.notNull()
		.references(() => blockDay.id, { onDelete: 'cascade' }),
	name: text('name'),
	notes: text('notes'),
	sequence: integer('sequence')
});

// Exercises inside a workout
export const workoutExercise = pgTable('workout_exercise', {
	id: serial('id').primaryKey(),
	workoutId: integer('workout_id')
		.notNull()
		.references(() => workout.id, { onDelete: 'cascade' }),
	exerciseId: integer('exercise_id')
		.notNull()
		.references(() => exercise.id, { onDelete: 'cascade' }),
	sets: integer('sets'),
	reps: text('reps'),
	weight: doublePrecision('weight'),
	restSeconds: integer('rest_seconds'),
	notes: text('notes'),
	sequence: integer('sequence'),
	groupName: text('group_name')
});

// Workout logging
export const workoutLog = pgTable('workout_log', {
	id: serial('id').primaryKey(),
	workoutExerciseId: integer('workout_exercise_id')
		.notNull()
		.references(() => workoutExercise.id, { onDelete: 'cascade' }),
	performedSets: integer('performed_sets'),
	performedReps: text('performed_reps'),
	performedWeight: doublePrecision('performed_weight'),
	date: text('date'),
	notes: text('notes')
});

// User check-ins
export const userCheckin = pgTable('user_checkin', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userProfile.id, { onDelete: 'cascade' }),
	date: text('date'),
	weight: doublePrecision('weight'),
	waist: doublePrecision('waist'),
	chest: doublePrecision('chest'),
	hips: doublePrecision('hips'),
	steps: integer('steps'),
	bodyFat: doublePrecision('body_fat'),
	notes: text('notes')
});

// ============ RELATIONS ============

export const userProfileRelations = relations(userProfile, ({ many }) => ({
	programs: many(program),
	checkins: many(userCheckin)
}));

export const muscleRelations = relations(muscle, ({ many }) => ({
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

// Export inferred types
export type Muscle = InferSelectModel<typeof muscle>;
export type Equipment = InferSelectModel<typeof equipment>;
export type Exercise = InferSelectModel<typeof exercise>;
export type ExerciseMuscle = InferSelectModel<typeof exerciseMuscle>;
export type ExerciseEquipment = InferSelectModel<typeof exerciseEquipment>;
