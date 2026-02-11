import { it, vi, expect, describe, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../db', () => ({
	db: {
		select: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn(),
		values: vi.fn().mockReturnThis(),
		returning: vi.fn(),
		set: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		offset: vi.fn(),
		innerJoin: vi.fn().mockReturnThis(),
		transaction: vi.fn(),
		query: {
			program: {
				findFirst: vi.fn()
			}
		}
	}
}));

import { db } from '../db';

// vi.mock adds `where` directly on db via mockReturnThis() chain; cast once for all tests
const mockWhere = (db as unknown as { where: ReturnType<typeof vi.fn> }).where;

import {
	deleteDay,
	insertDay,
	updateDay,
	deleteBlock,
	getPrograms,
	insertBlock,
	updateBlock,
	deleteProgram,
	deleteWorkout,
	insertProgram,
	insertWorkout,
	updateProgram,
	updateWorkout,
	getProgramFull,
	verifyDayOwnership,
	verifyBlockOwnership,
	deleteWorkoutExercise,
	insertWorkoutExercise,
	updateWorkoutExercise,
	verifyProgramOwnership,
	verifyWorkoutOwnership,
	verifyWorkoutExerciseOwnership
} from './programs';

// ============ OWNERSHIP VERIFICATION ============

describe('verifyProgramOwnership', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns program when owned by user', async () => {
		const mockProgram = {
			id: 1,
			name: 'PPL',
			userId: 42,
			description: null,
			startDate: null,
			endDate: null
		};
		mockWhere.mockResolvedValue([mockProgram]);

		const result = await verifyProgramOwnership(1, 42);
		expect(result).toEqual(mockProgram);
	});

	it('returns null when program not owned', async () => {
		mockWhere.mockResolvedValue([]);

		const result = await verifyProgramOwnership(1, 99);
		expect(result).toBeNull();
	});
});

describe('verifyBlockOwnership', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns block when owned via program', async () => {
		const mockBlock = {
			id: 1,
			programId: 1,
			name: 'Week 1-4',
			description: null,
			sequence: 1,
			durationWeeks: 4
		};
		mockWhere.mockResolvedValue([{ block: mockBlock }]);

		const result = await verifyBlockOwnership(1, 42);
		expect(result).toEqual(mockBlock);
	});

	it('returns null when not owned', async () => {
		mockWhere.mockResolvedValue([]);

		const result = await verifyBlockOwnership(1, 99);
		expect(result).toBeNull();
	});
});

describe('verifyDayOwnership', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns day when owned via block → program', async () => {
		const mockDay = { id: 1, blockId: 1, name: 'Push', sequence: 1 };
		mockWhere.mockResolvedValue([{ blockDay: mockDay }]);

		const result = await verifyDayOwnership(1, 42);
		expect(result).toEqual(mockDay);
	});

	it('returns null when not owned', async () => {
		mockWhere.mockResolvedValue([]);

		const result = await verifyDayOwnership(1, 99);
		expect(result).toBeNull();
	});
});

describe('verifyWorkoutOwnership', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns workout when owned', async () => {
		const mockWorkout = { id: 1, blockDayId: 1, name: 'Morning', notes: null, sequence: 1 };
		mockWhere.mockResolvedValue([{ workout: mockWorkout }]);

		const result = await verifyWorkoutOwnership(1, 42);
		expect(result).toEqual(mockWorkout);
	});

	it('returns null when not owned', async () => {
		mockWhere.mockResolvedValue([]);

		const result = await verifyWorkoutOwnership(1, 99);
		expect(result).toBeNull();
	});
});

describe('verifyWorkoutExerciseOwnership', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns exercise when owned', async () => {
		const mockExercise = {
			id: 1,
			workoutId: 1,
			exerciseId: 5,
			sets: 3,
			reps: '8-12',
			weight: null,
			restSeconds: 90,
			notes: null,
			sequence: 1,
			groupName: null
		};
		mockWhere.mockResolvedValue([{ workoutExercise: mockExercise }]);

		const result = await verifyWorkoutExerciseOwnership(1, 42);
		expect(result).toEqual(mockExercise);
	});

	it('returns null when not owned', async () => {
		mockWhere.mockResolvedValue([]);

		const result = await verifyWorkoutExerciseOwnership(1, 99);
		expect(result).toBeNull();
	});
});

// ============ PROGRAM CRUD ============

describe('getPrograms', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns list of user programs', async () => {
		const programs = [
			{ id: 1, name: 'PPL', userId: 42, description: null, startDate: null, endDate: null },
			{
				id: 2,
				name: 'Upper Lower',
				userId: 42,
				description: 'Split',
				startDate: null,
				endDate: null
			}
		];
		const mockOffset = vi.fn().mockResolvedValue(programs);
		const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
		const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
		mockWhere.mockReturnValue({ orderBy: mockOrderBy });

		const result = await getPrograms(42);
		expect(result).toEqual(programs);
		expect(result).toHaveLength(2);
	});

	it('returns empty array when user has no programs', async () => {
		const mockOffset = vi.fn().mockResolvedValue([]);
		const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
		const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
		mockWhere.mockReturnValue({ orderBy: mockOrderBy });

		const result = await getPrograms(42);
		expect(result).toEqual([]);
	});
});

describe('getProgramFull', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns full nested program', async () => {
		const fullProgram = {
			id: 1,
			name: 'PPL',
			userId: 42,
			description: null,
			startDate: null,
			endDate: null,
			blocks: [
				{
					id: 1,
					programId: 1,
					name: 'Block 1',
					description: null,
					sequence: 1,
					durationWeeks: 4,
					days: [
						{
							id: 1,
							blockId: 1,
							name: 'Push',
							sequence: 1,
							workouts: [
								{
									id: 1,
									blockDayId: 1,
									name: 'Main',
									notes: null,
									sequence: 1,
									exercises: []
								}
							]
						}
					]
				}
			]
		};

		(db.query.program.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(fullProgram);

		const result = await getProgramFull(1, 42);
		expect(result).toEqual(fullProgram);
		expect(result?.blocks).toHaveLength(1);
		expect(result?.blocks[0].days).toHaveLength(1);
	});

	it('returns null when program not found', async () => {
		(db.query.program.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

		const result = await getProgramFull(999, 42);
		expect(result).toBeNull();
	});
});

describe('insertProgram', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates a simple program without blocks', async () => {
		const created = {
			id: 1,
			name: 'PPL',
			userId: 42,
			description: null,
			startDate: null,
			endDate: null
		};
		const mockReturning = vi.fn().mockResolvedValue([created]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({ values: mockValues });

		const result = await insertProgram({ name: 'PPL' }, 42);
		expect(result).toEqual(created);
		expect(result.name).toBe('PPL');
	});

	it('creates a program with nested blocks via transaction', async () => {
		const created = {
			id: 1,
			name: 'PPL',
			userId: 42,
			description: null,
			startDate: null,
			endDate: null
		};
		const mockTx = {
			insert: vi.fn().mockReturnValue({
				values: vi.fn().mockReturnValue({
					returning: vi.fn().mockResolvedValue([created])
				})
			})
		};
		(db.transaction as ReturnType<typeof vi.fn>).mockImplementation(async (fn) => fn(mockTx));

		const result = await insertProgram(
			{
				name: 'PPL',
				blocks: [{ name: 'Block 1', sequence: 1 }]
			},
			42
		);
		expect(result).toEqual(created);
		expect(db.transaction).toHaveBeenCalled();
	});
});

describe('updateProgram', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('updates program when owned', async () => {
		const mockProgram = {
			id: 1,
			name: 'PPL',
			userId: 42,
			description: null,
			startDate: null,
			endDate: null
		};

		// First call: verifyProgramOwnership
		mockWhere.mockResolvedValueOnce([mockProgram]);
		// Second call: the update
		mockWhere.mockResolvedValueOnce(undefined);

		const result = await updateProgram(1, 42, { name: 'Updated PPL' });
		expect(result).toBe(true);
	});

	it('returns false when not owned', async () => {
		mockWhere.mockResolvedValueOnce([]);

		const result = await updateProgram(1, 99, { name: 'Nope' });
		expect(result).toBe(false);
	});
});

describe('deleteProgram', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('deletes program when owned', async () => {
		const mockProgram = {
			id: 1,
			name: 'PPL',
			userId: 42,
			description: null,
			startDate: null,
			endDate: null
		};

		// verifyProgramOwnership
		mockWhere.mockResolvedValueOnce([mockProgram]);
		// delete returning
		const mockReturning = vi.fn().mockResolvedValue([{ deletedId: 1 }]);
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnValue({ returning: mockReturning })
		});

		const result = await deleteProgram(1, 42);
		expect(result).toBe(true);
	});

	it('returns false when not owned', async () => {
		mockWhere.mockResolvedValueOnce([]);

		const result = await deleteProgram(1, 99);
		expect(result).toBe(false);
	});
});

// ============ BLOCK CRUD ============

describe('insertBlock', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates block when program is owned', async () => {
		const mockProgram = {
			id: 1,
			name: 'PPL',
			userId: 42,
			description: null,
			startDate: null,
			endDate: null
		};
		const createdBlock = {
			id: 1,
			programId: 1,
			name: 'Week 1-4',
			description: null,
			sequence: 1,
			durationWeeks: 4
		};

		// verifyProgramOwnership
		mockWhere.mockResolvedValueOnce([mockProgram]);
		// insert
		const mockReturning = vi.fn().mockResolvedValue([createdBlock]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({ values: mockValues });

		const result = await insertBlock(1, 42, { name: 'Week 1-4', sequence: 1, durationWeeks: 4 });
		expect(result).toEqual(createdBlock);
	});

	it('returns null when program not owned', async () => {
		mockWhere.mockResolvedValueOnce([]);

		const result = await insertBlock(1, 99, { name: 'Nope' });
		expect(result).toBeNull();
	});
});

describe('updateBlock', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('updates block when owned via program', async () => {
		const mockBlock = {
			id: 1,
			programId: 1,
			name: 'Week 1-4',
			description: null,
			sequence: 1,
			durationWeeks: 4
		};

		mockWhere.mockResolvedValueOnce([{ block: mockBlock }]);
		mockWhere.mockResolvedValueOnce(undefined);

		const result = await updateBlock(1, 42, { name: 'Updated' });
		expect(result).toBe(true);
	});
});

describe('deleteBlock', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('deletes block when owned', async () => {
		const mockBlock = {
			id: 1,
			programId: 1,
			name: 'Week 1-4',
			description: null,
			sequence: 1,
			durationWeeks: 4
		};

		mockWhere.mockResolvedValueOnce([{ block: mockBlock }]);
		const mockReturning = vi.fn().mockResolvedValue([{ deletedId: 1 }]);
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnValue({ returning: mockReturning })
		});

		const result = await deleteBlock(1, 42);
		expect(result).toBe(true);
	});
});

// ============ DAY CRUD ============

describe('insertDay', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates day when block is owned', async () => {
		const mockBlock = {
			id: 1,
			programId: 1,
			name: 'Week 1-4',
			description: null,
			sequence: 1,
			durationWeeks: 4
		};
		const createdDay = { id: 1, blockId: 1, name: 'Push', sequence: 1 };

		mockWhere.mockResolvedValueOnce([{ block: mockBlock }]);
		const mockReturning = vi.fn().mockResolvedValue([createdDay]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({ values: mockValues });

		const result = await insertDay(1, 42, { name: 'Push', sequence: 1 });
		expect(result).toEqual(createdDay);
	});
});

describe('updateDay', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('updates day when owned', async () => {
		const mockDay = { id: 1, blockId: 1, name: 'Push', sequence: 1 };
		mockWhere.mockResolvedValueOnce([{ blockDay: mockDay }]);
		mockWhere.mockResolvedValueOnce(undefined);

		const result = await updateDay(1, 42, { name: 'Pull' });
		expect(result).toBe(true);
	});
});

describe('deleteDay', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('deletes day when owned', async () => {
		const mockDay = { id: 1, blockId: 1, name: 'Push', sequence: 1 };
		mockWhere.mockResolvedValueOnce([{ blockDay: mockDay }]);
		const mockReturning = vi.fn().mockResolvedValue([{ deletedId: 1 }]);
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnValue({ returning: mockReturning })
		});

		const result = await deleteDay(1, 42);
		expect(result).toBe(true);
	});
});

// ============ WORKOUT CRUD ============

describe('insertWorkout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates workout when day is owned', async () => {
		const mockDay = { id: 1, blockId: 1, name: 'Push', sequence: 1 };
		const createdWorkout = { id: 1, blockDayId: 1, name: 'Main', notes: null, sequence: 1 };

		mockWhere.mockResolvedValueOnce([{ blockDay: mockDay }]);
		const mockReturning = vi.fn().mockResolvedValue([createdWorkout]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({ values: mockValues });

		const result = await insertWorkout(1, 42, { name: 'Main', sequence: 1 });
		expect(result).toEqual(createdWorkout);
	});
});

describe('updateWorkout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('updates workout when owned', async () => {
		const mockWorkout = { id: 1, blockDayId: 1, name: 'Main', notes: null, sequence: 1 };
		mockWhere.mockResolvedValueOnce([{ workout: mockWorkout }]);
		mockWhere.mockResolvedValueOnce(undefined);

		const result = await updateWorkout(1, 42, { name: 'Updated' });
		expect(result).toBe(true);
	});
});

describe('deleteWorkout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('deletes workout when owned', async () => {
		const mockWorkout = { id: 1, blockDayId: 1, name: 'Main', notes: null, sequence: 1 };
		mockWhere.mockResolvedValueOnce([{ workout: mockWorkout }]);
		const mockReturning = vi.fn().mockResolvedValue([{ deletedId: 1 }]);
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnValue({ returning: mockReturning })
		});

		const result = await deleteWorkout(1, 42);
		expect(result).toBe(true);
	});
});

// ============ WORKOUT EXERCISE CRUD ============

describe('insertWorkoutExercise', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates workout exercise when workout is owned', async () => {
		const mockWorkout = { id: 1, blockDayId: 1, name: 'Main', notes: null, sequence: 1 };
		const createdExercise = {
			id: 1,
			workoutId: 1,
			exerciseId: 5,
			sets: 3,
			reps: '8-12',
			weight: null,
			restSeconds: 90,
			notes: null,
			sequence: 1,
			groupName: null
		};

		mockWhere.mockResolvedValueOnce([{ workout: mockWorkout }]);
		const mockReturning = vi.fn().mockResolvedValue([createdExercise]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({ values: mockValues });

		const result = await insertWorkoutExercise(1, 42, {
			exerciseId: 5,
			sets: 3,
			reps: '8-12',
			restSeconds: 90,
			sequence: 1
		});
		expect(result).toEqual(createdExercise);
	});
});

describe('updateWorkoutExercise', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('updates exercise when owned', async () => {
		const mockExercise = {
			id: 1,
			workoutId: 1,
			exerciseId: 5,
			sets: 3,
			reps: '8-12',
			weight: null,
			restSeconds: 90,
			notes: null,
			sequence: 1,
			groupName: null
		};
		mockWhere.mockResolvedValueOnce([{ workoutExercise: mockExercise }]);
		mockWhere.mockResolvedValueOnce(undefined);

		const result = await updateWorkoutExercise(1, 42, { sets: 4 });
		expect(result).toBe(true);
	});
});

describe('deleteWorkoutExercise', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('deletes exercise when owned', async () => {
		const mockExercise = {
			id: 1,
			workoutId: 1,
			exerciseId: 5,
			sets: 3,
			reps: '8-12',
			weight: null,
			restSeconds: 90,
			notes: null,
			sequence: 1,
			groupName: null
		};
		mockWhere.mockResolvedValueOnce([{ workoutExercise: mockExercise }]);
		const mockReturning = vi.fn().mockResolvedValue([{ deletedId: 1 }]);
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnValue({ returning: mockReturning })
		});

		const result = await deleteWorkoutExercise(1, 42);
		expect(result).toBe(true);
	});
});
