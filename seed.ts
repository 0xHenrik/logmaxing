// seed.ts
import { db } from './src/lib/server/db';
import { muscles, exercises, volumeThresholds, equipment as equipmentData } from './seed-data';
import {
	muscle,
	exercise,
	equipment,
	exerciseMuscle,
	exerciseEquipment,
	muscleVolumeThreshold
} from './src/lib/server/db/schema';

async function seed() {
	console.log('🌱 Starting seed...\n');

	// Clear existing data (in reverse order of dependencies)
	console.log('Clearing existing data...');
	await db.delete(exerciseEquipment);
	await db.delete(exerciseMuscle);
	await db.delete(muscleVolumeThreshold);
	await db.delete(exercise);
	await db.delete(equipment);
	await db.delete(muscle);

	// 1. Seed muscles
	console.log('Seeding muscles...');
	const insertedMuscles = await db
		.insert(muscle)
		.values(muscles.map((m) => ({ name: m.name, muscleGroup: m.muscleGroup })))
		.returning();

	const muscleMap = new Map(insertedMuscles.map((m) => [m.name, m.id]));
	console.log(`  ✓ Inserted ${insertedMuscles.length} muscles`);

	// 2. Seed volume thresholds
	console.log('Seeding volume thresholds...');
	const thresholdValues = volumeThresholds
		.map((vt) => {
			const muscleId = muscleMap.get(vt.muscle);
			if (!muscleId) {
				console.warn(`  ⚠ Muscle not found for threshold: ${vt.muscle}`);
				return null;
			}
			return {
				muscleId,
				mv: vt.mv,
				mev: vt.mev,
				mavMin: vt.mavMin,
				mavMax: vt.mavMax,
				mrv: vt.mrv
			};
		})
		.filter((v): v is NonNullable<typeof v> => v !== null);

	await db.insert(muscleVolumeThreshold).values(thresholdValues);
	console.log(`  ✓ Inserted ${thresholdValues.length} volume thresholds`);

	// 3. Seed equipment
	console.log('Seeding equipment...');
	const insertedEquipment = await db
		.insert(equipment)
		.values(equipmentData.map((e) => ({ name: e.name })))
		.returning();

	const equipmentMap = new Map(insertedEquipment.map((e) => [e.name, e.id]));
	console.log(`  ✓ Inserted ${insertedEquipment.length} equipment items`);

	// 4. Seed exercises
	console.log('Seeding exercises...');
	const insertedExercises = await db
		.insert(exercise)
		.values(exercises.map((e) => ({ name: e.name })))
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

	await db.insert(exerciseMuscle).values(exerciseMuscleValues);
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

	await db.insert(exerciseEquipment).values(exerciseEquipmentValues);
	console.log(`  ✓ Inserted ${exerciseEquipmentValues.length} exercise-equipment relationships`);

	console.log('\n✅ Seed completed successfully!');
	console.log('\nSummary:');
	console.log(`  - ${insertedMuscles.length} muscles`);
	console.log(`  - ${thresholdValues.length} volume thresholds`);
	console.log(`  - ${insertedEquipment.length} equipment items`);
	console.log(`  - ${insertedExercises.length} exercises`);
	console.log(`  - ${exerciseMuscleValues.length} exercise-muscle links`);
	console.log(`  - ${exerciseEquipmentValues.length} exercise-equipment links`);
}

seed().catch((err) => {
	console.error('❌ Seed failed:', err);
	process.exit(1);
});
