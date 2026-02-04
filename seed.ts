// seed.ts - PostgreSQL version for Supabase
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import { muscles, exercises, equipment as equipmentData } from './seed-data';
import {
	muscle,
	exercise,
	equipment,
	exerciseMuscle,
	exerciseEquipment
} from './src/lib/server/db/schema';

import 'dotenv/config';

// Create a dedicated connection for seeding
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
	console.error('DATABASE_URL environment variable is not set');
	process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function seed() {
	console.log('🌱 Starting seed...\n');
	console.log(`📡 Connecting to Supabase PostgreSQL...`);

	try {
		// Clear existing data (in reverse order of dependencies)
		console.log('Clearing existing data...');
		await db.delete(exerciseEquipment);
		await db.delete(exerciseMuscle);
		await db.delete(exercise);
		await db.delete(equipment);
		await db.delete(muscle);
		console.log('  ✓ Existing data cleared');

		// 1. Seed muscles (with volume thresholds and recovery data)
		console.log('Seeding muscles...');
		const insertedMuscles = await db
			.insert(muscle)
			.values(
				muscles.map((m) => ({
					name: m.name,
					muscleGroup: m.muscleGroup,
					mv: m.mv,
					mev: m.mev,
					mavMin: m.mavMin,
					mavMax: m.mavMax,
					mrv: m.mrv,
					// New recovery fields
					recoveryDays: m.recoveryDays,
					frequencyMin: m.frequencyMin,
					frequencyMax: m.frequencyMax,
					trainingTips: m.trainingTips
				}))
			)
			.returning();

		const muscleMap = new Map(insertedMuscles.map((m) => [m.name, m.id]));
		console.log(`  ✓ Inserted ${insertedMuscles.length} muscles with volume thresholds`);

		// 3. Seed equipment
		console.log('Seeding equipment...');
		const insertedEquipment = await db
			.insert(equipment)
			.values(equipmentData.map((e) => ({ name: e.name })))
			.returning();

		const equipmentMap = new Map(insertedEquipment.map((e) => [e.name, e.id]));
		console.log(`  ✓ Inserted ${insertedEquipment.length} equipment items`);

		// 4. Seed exercises (with optional biomechanics data)
		console.log('Seeding exercises...');
		const insertedExercises = await db
			.insert(exercise)
			.values(
				exercises.map((e) => ({
					name: e.name,
					// Biomechanics fields - will be null if not provided in seed data
					difficulty: 'difficulty' in e ? (e.difficulty as string) : null,
					instructions: 'instructions' in e ? (e.instructions as string[]) : null,
					tips: 'tips' in e ? (e.tips as string[]) : null,
					movementPattern: 'movementPattern' in e ? (e.movementPattern as string) : null,
					plane: 'plane' in e ? (e.plane as string) : null,
					jointActions: 'jointActions' in e ? (e.jointActions as string[]) : null,
					forceProfile: 'forceProfile' in e ? (e.forceProfile as string) : null,
					stretchPosition: 'stretchPosition' in e ? (e.stretchPosition as string) : null,
					stabilityDemand: 'stabilityDemand' in e ? (e.stabilityDemand as string) : null,
					unilateral: 'unilateral' in e ? (e.unilateral as boolean) : false,
					gripType: 'gripType' in e ? (e.gripType as string) : null
				}))
			)
			.returning();

		const exerciseMap = new Map(insertedExercises.map((e) => [e.name, e.id]));
		console.log(`  ✓ Inserted ${insertedExercises.length} exercises`);

		// 5. Seed exercise-muscle relationships
		console.log('Seeding exercise-muscle relationships...');
		const exerciseMuscleValues: {
			exerciseId: number;
			muscleId: number;
			activationType: string;
			weighting: number;
		}[] = [];

		for (const ex of exercises) {
			const exerciseId = exerciseMap.get(ex.name);
			if (!exerciseId) continue;

			for (const m of ex.muscles) {
				const muscleId = muscleMap.get(m.muscle);
				if (!muscleId) {
					console.warn(`  ⚠ Muscle not found: ${m.muscle} for exercise ${ex.name}`);
					continue;
				}
				exerciseMuscleValues.push({
					exerciseId,
					muscleId,
					activationType: m.activation,
					weighting: m.weighting
				});
			}
		}

		if (exerciseMuscleValues.length > 0) {
			// Insert in batches to avoid hitting limits
			const batchSize = 500;
			for (let i = 0; i < exerciseMuscleValues.length; i += batchSize) {
				const batch = exerciseMuscleValues.slice(i, i + batchSize);
				await db.insert(exerciseMuscle).values(batch);
			}
		}
		console.log(`  ✓ Inserted ${exerciseMuscleValues.length} exercise-muscle relationships`);

		// 6. Seed exercise-equipment relationships
		console.log('Seeding exercise-equipment relationships...');
		const exerciseEquipmentValues: { exerciseId: number; equipmentId: number }[] = [];

		for (const ex of exercises) {
			const exerciseId = exerciseMap.get(ex.name);
			if (!exerciseId) continue;

			for (const eq of ex.equipment) {
				const equipmentId = equipmentMap.get(eq);
				if (!equipmentId) {
					console.warn(`  ⚠ Equipment not found: ${eq} for exercise ${ex.name}`);
					continue;
				}
				exerciseEquipmentValues.push({
					exerciseId,
					equipmentId
				});
			}
		}

		if (exerciseEquipmentValues.length > 0) {
			// Insert in batches to avoid hitting limits
			const batchSize = 500;
			for (let i = 0; i < exerciseEquipmentValues.length; i += batchSize) {
				const batch = exerciseEquipmentValues.slice(i, i + batchSize);
				await db.insert(exerciseEquipment).values(batch);
			}
		}
		console.log(`  ✓ Inserted ${exerciseEquipmentValues.length} exercise-equipment relationships`);

		console.log('\n✅ Seed completed successfully!');
		console.log('\n📊 Summary:');
		console.log(`  - ${insertedMuscles.length} muscles (with volume thresholds)`);
		console.log(`  - ${insertedEquipment.length} equipment items`);
		console.log(`  - ${insertedExercises.length} exercises`);
		console.log(`  - ${exerciseMuscleValues.length} exercise-muscle links`);
		console.log(`  - ${exerciseEquipmentValues.length} exercise-equipment links`);
	} catch (error) {
		console.error('❌ Seed failed:', error);
		throw error;
	} finally {
		// Close the connection
		await client.end();
	}
}

seed().catch((err) => {
	console.error('❌ Seed failed:', err);
	process.exit(1);
});
