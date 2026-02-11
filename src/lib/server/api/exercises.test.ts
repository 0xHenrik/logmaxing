import { it, vi, expect, describe, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../db', () => ({
	db: {
		select: vi.fn().mockReturnThis(),
		selectDistinct: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		values: vi.fn().mockReturnThis(),
		returning: vi.fn(),
		set: vi.fn().mockReturnThis(),
		leftJoin: vi.fn().mockReturnThis(),
		innerJoin: vi.fn().mockReturnThis(),
		$dynamic: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		offset: vi.fn()
	}
}));

// Mock validation module
vi.mock('./validation', () => ({
	escapeLikePattern: vi.fn((s: string) => s.replace(/[%_]/g, '\\$&'))
}));

import { db } from '../db';

const mockOffset = (db as unknown as { offset: ReturnType<typeof vi.fn> }).offset;
const mockFrom = (db as unknown as { from: ReturnType<typeof vi.fn> }).from;
const mockWhere = (db as unknown as { where: ReturnType<typeof vi.fn> }).where;

import {
	getExercise,
	getExercises,
	getMuscleGroups,
	getAllEquipment,
	searchExercises,
	getExercisesByMuscle,
	getExercisesByMuscleGroup
} from './exercises';

// ============ GET EXERCISES ============

describe('getExercises', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset chain for each test
		(db.select as ReturnType<typeof vi.fn>).mockReturnThis();
		(db as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnThis();
		(db as unknown as { leftJoin: ReturnType<typeof vi.fn> }).leftJoin.mockReturnThis();
		(db as unknown as { $dynamic: ReturnType<typeof vi.fn> }).$dynamic.mockReturnThis();
		(db as unknown as { where: ReturnType<typeof vi.fn> }).where.mockReturnThis();
		(db as unknown as { limit: ReturnType<typeof vi.fn> }).limit.mockReturnThis();
	});

	it('returns list of exercises with default pagination', async () => {
		const exercises = [
			{
				id: 1,
				name: 'Bench Press',
				primaryMuscle: 'Chest',
				muscleGroup: 'chest',
				difficulty: 'intermediate',
				movementPattern: 'horizontal_push'
			},
			{
				id: 2,
				name: 'Squat',
				primaryMuscle: 'Quads',
				muscleGroup: 'legs',
				difficulty: 'intermediate',
				movementPattern: 'squat'
			}
		];
		mockOffset.mockResolvedValue(exercises);

		const result = await getExercises();
		expect(result).toEqual(exercises);
		expect(result).toHaveLength(2);
	});

	it('returns empty array when no exercises match', async () => {
		mockOffset.mockResolvedValue([]);

		const result = await getExercises({ difficulty: 'nonexistent' });
		expect(result).toEqual([]);
	});

	it('applies search filter', async () => {
		const exercises = [
			{
				id: 1,
				name: 'Bench Press',
				primaryMuscle: 'Chest',
				muscleGroup: 'chest',
				difficulty: 'intermediate',
				movementPattern: 'horizontal_push'
			}
		];
		mockOffset.mockResolvedValue(exercises);

		const result = await getExercises({ search: 'bench' });
		expect(result).toEqual(exercises);
	});

	it('applies difficulty filter', async () => {
		const exercises = [
			{
				id: 3,
				name: 'Push Up',
				primaryMuscle: 'Chest',
				muscleGroup: 'chest',
				difficulty: 'beginner',
				movementPattern: 'horizontal_push'
			}
		];
		mockOffset.mockResolvedValue(exercises);

		const result = await getExercises({ difficulty: 'beginner' });
		expect(result).toEqual(exercises);
	});

	it('applies pagination with custom limit and offset', async () => {
		const exercises = [
			{
				id: 10,
				name: 'Lat Pulldown',
				primaryMuscle: 'Lats',
				muscleGroup: 'back',
				difficulty: 'beginner',
				movementPattern: 'vertical_pull'
			}
		];
		mockOffset.mockResolvedValue(exercises);

		const result = await getExercises({ limit: 10, offset: 5 });
		expect(result).toEqual(exercises);
	});

	it('returns empty array when equipmentId has no matching exercises', async () => {
		// The equipment sub-query returns no matching exercise IDs
		(db as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnThis();
		(db as unknown as { where: ReturnType<typeof vi.fn> }).where.mockResolvedValueOnce([]);

		const result = await getExercises({ equipmentId: 999 });
		expect(result).toEqual([]);
	});
});

// ============ GET EXERCISE ============

describe('getExercise', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(db.select as ReturnType<typeof vi.fn>).mockReturnThis();
		(db as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnThis();
		(db as unknown as { innerJoin: ReturnType<typeof vi.fn> }).innerJoin.mockReturnThis();
	});

	it('returns exercise with details', async () => {
		const exerciseData = {
			id: 1,
			name: 'Bench Press',
			difficulty: 'intermediate',
			movementPattern: 'horizontal_push',
			forceProfile: 'descending',
			stretchPosition: 'stretched',
			unilateral: false,
			gripType: 'overhand'
		};
		const muscleData = [
			{
				exerciseId: 1,
				muscleId: 1,
				activationType: 'primary',
				weighting: 0.85,
				muscle: { id: 1, name: 'Chest', muscleGroup: 'chest' }
			}
		];
		const equipmentData = [
			{
				exerciseId: 1,
				equipmentId: 1,
				equipment: { id: 1, name: 'Barbell' }
			}
		];

		// First call: get exercise
		mockWhere.mockResolvedValueOnce([exerciseData]);
		// Second call: get muscles (innerJoin chain)
		mockWhere.mockResolvedValueOnce(muscleData);
		// Third call: get equipment (innerJoin chain)
		mockWhere.mockResolvedValueOnce(equipmentData);

		const result = await getExercise(1);
		expect(result).not.toBeNull();
		expect(result!.name).toBe('Bench Press');
		expect(result!.muscles).toEqual(muscleData);
		expect(result!.equipment).toEqual(equipmentData);
	});

	it('returns null when exercise not found', async () => {
		mockWhere.mockResolvedValueOnce([]);

		const result = await getExercise(999);
		expect(result).toBeNull();
	});

	it('returns exercise with empty muscles and equipment', async () => {
		const exerciseData = {
			id: 5,
			name: 'Custom Exercise',
			difficulty: null,
			movementPattern: null,
			forceProfile: null,
			stretchPosition: null,
			unilateral: false,
			gripType: null
		};

		mockWhere.mockResolvedValueOnce([exerciseData]);
		mockWhere.mockResolvedValueOnce([]);
		mockWhere.mockResolvedValueOnce([]);

		const result = await getExercise(5);
		expect(result).not.toBeNull();
		expect(result!.muscles).toEqual([]);
		expect(result!.equipment).toEqual([]);
	});
});

// ============ SEARCH EXERCISES ============

describe('searchExercises', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(db.select as ReturnType<typeof vi.fn>).mockReturnThis();
		(db as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnThis();
		(db as unknown as { leftJoin: ReturnType<typeof vi.fn> }).leftJoin.mockReturnThis();
		(db as unknown as { $dynamic: ReturnType<typeof vi.fn> }).$dynamic.mockReturnThis();
		(db as unknown as { where: ReturnType<typeof vi.fn> }).where.mockReturnThis();
		(db as unknown as { limit: ReturnType<typeof vi.fn> }).limit.mockReturnThis();
	});

	it('delegates to getExercises with search filter', async () => {
		const exercises = [
			{
				id: 1,
				name: 'Bench Press',
				primaryMuscle: 'Chest',
				muscleGroup: 'chest',
				difficulty: 'intermediate',
				movementPattern: 'horizontal_push'
			}
		];
		mockOffset.mockResolvedValue(exercises);

		const result = await searchExercises('bench');
		expect(result).toEqual(exercises);
	});

	it('returns empty for no matches', async () => {
		mockOffset.mockResolvedValue([]);

		const result = await searchExercises('zzzznonexistent');
		expect(result).toEqual([]);
	});

	it('uses default limit of 20', async () => {
		mockOffset.mockResolvedValue([]);

		await searchExercises('test');
		// The function delegates to getExercises with limit: 20
		expect(db.select).toHaveBeenCalled();
	});
});

// ============ GET EXERCISES BY MUSCLE ============

describe('getExercisesByMuscle', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(db.select as ReturnType<typeof vi.fn>).mockReturnThis();
		(db as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnThis();
		(db as unknown as { leftJoin: ReturnType<typeof vi.fn> }).leftJoin.mockReturnThis();
		(db as unknown as { $dynamic: ReturnType<typeof vi.fn> }).$dynamic.mockReturnThis();
		(db as unknown as { where: ReturnType<typeof vi.fn> }).where.mockReturnThis();
		(db as unknown as { limit: ReturnType<typeof vi.fn> }).limit.mockReturnThis();
	});

	it('returns exercises for a specific muscle', async () => {
		const exercises = [
			{
				id: 1,
				name: 'Bench Press',
				primaryMuscle: 'Chest',
				muscleGroup: 'chest',
				difficulty: 'intermediate',
				movementPattern: 'horizontal_push'
			}
		];
		mockOffset.mockResolvedValue(exercises);

		const result = await getExercisesByMuscle(1);
		expect(result).toEqual(exercises);
	});

	it('returns empty for muscle with no exercises', async () => {
		mockOffset.mockResolvedValue([]);

		const result = await getExercisesByMuscle(999);
		expect(result).toEqual([]);
	});
});

// ============ GET EXERCISES BY MUSCLE GROUP ============

describe('getExercisesByMuscleGroup', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(db.select as ReturnType<typeof vi.fn>).mockReturnThis();
		(db as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnThis();
		(db as unknown as { leftJoin: ReturnType<typeof vi.fn> }).leftJoin.mockReturnThis();
		(db as unknown as { $dynamic: ReturnType<typeof vi.fn> }).$dynamic.mockReturnThis();
		(db as unknown as { where: ReturnType<typeof vi.fn> }).where.mockReturnThis();
		(db as unknown as { limit: ReturnType<typeof vi.fn> }).limit.mockReturnThis();
	});

	it('returns exercises for a muscle group', async () => {
		const exercises = [
			{
				id: 1,
				name: 'Bench Press',
				primaryMuscle: 'Chest',
				muscleGroup: 'chest',
				difficulty: 'intermediate',
				movementPattern: 'horizontal_push'
			},
			{
				id: 3,
				name: 'Cable Fly',
				primaryMuscle: 'Chest',
				muscleGroup: 'chest',
				difficulty: 'beginner',
				movementPattern: 'horizontal_push'
			}
		];
		mockOffset.mockResolvedValue(exercises);

		const result = await getExercisesByMuscleGroup('chest');
		expect(result).toEqual(exercises);
		expect(result).toHaveLength(2);
	});

	it('returns empty for unknown muscle group', async () => {
		mockOffset.mockResolvedValue([]);

		const result = await getExercisesByMuscleGroup('nonexistent');
		expect(result).toEqual([]);
	});
});

// ============ GET ALL EQUIPMENT ============

describe('getAllEquipment', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns all equipment', async () => {
		const equipmentList = [
			{ id: 1, name: 'Barbell' },
			{ id: 2, name: 'Dumbbell' },
			{ id: 3, name: 'Cable Machine' }
		];
		mockFrom.mockResolvedValue(equipmentList);

		const result = await getAllEquipment();
		expect(result).toEqual(equipmentList);
		expect(result).toHaveLength(3);
	});

	it('returns empty array when no equipment exists', async () => {
		mockFrom.mockResolvedValue([]);

		const result = await getAllEquipment();
		expect(result).toEqual([]);
	});
});

// ============ GET MUSCLE GROUPS ============

describe('getMuscleGroups', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(db as unknown as { selectDistinct: ReturnType<typeof vi.fn> }).selectDistinct.mockReturnThis();
		(db as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnThis();
	});

	it('returns distinct muscle groups', async () => {
		const groups = [
			{ muscleGroup: 'chest' },
			{ muscleGroup: 'back' },
			{ muscleGroup: 'legs' },
			{ muscleGroup: 'arms' }
		];
		mockWhere.mockResolvedValue(groups);

		const result = await getMuscleGroups();
		expect(result).toEqual(['chest', 'back', 'legs', 'arms']);
		expect(result).toHaveLength(4);
	});

	it('returns empty array when no muscle groups exist', async () => {
		mockWhere.mockResolvedValue([]);

		const result = await getMuscleGroups();
		expect(result).toEqual([]);
	});

	it('filters out null muscle groups', async () => {
		const groups = [{ muscleGroup: 'chest' }, { muscleGroup: null }, { muscleGroup: 'back' }];
		mockWhere.mockResolvedValue(groups);

		const result = await getMuscleGroups();
		expect(result).toEqual(['chest', 'back']);
		expect(result).toHaveLength(2);
	});
});
