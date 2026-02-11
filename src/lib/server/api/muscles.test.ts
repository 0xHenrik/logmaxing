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
		set: vi.fn().mockReturnThis()
	}
}));

import { db } from '../db';

// vi.mock adds `where` directly on db via mockReturnThis() chain; cast once for all tests
const mockWhere = (db as unknown as { where: ReturnType<typeof vi.fn> }).where;
const mockFrom = (db as unknown as { from: ReturnType<typeof vi.fn> }).from;

import { getMuscle, getMuscles, deleteMuscle, insertMuscle, updateMuscle } from './muscles';

/** Restore the mock chain after tests that override terminal mocks */
function resetChain() {
	vi.clearAllMocks();
	(db.select as ReturnType<typeof vi.fn>).mockReturnThis();
	(db.update as ReturnType<typeof vi.fn>).mockReturnThis();
	mockFrom.mockReturnThis();
	(db as unknown as { set: ReturnType<typeof vi.fn> }).set.mockReturnThis();
}

// ============ GET MUSCLES ============

describe('getMuscles', () => {
	beforeEach(resetChain);

	it('returns all muscles', async () => {
		const muscles = [
			{
				id: 1,
				name: 'Chest',
				muscleGroup: 'chest',
				mv: 6,
				mev: 10,
				mavMin: 12,
				mavMax: 18,
				mrv: 22,
				recoveryDays: 2,
				frequencyMin: 2,
				frequencyMax: 3,
				trainingTips: null
			},
			{
				id: 2,
				name: 'Lats',
				muscleGroup: 'back',
				mv: 6,
				mev: 10,
				mavMin: 12,
				mavMax: 16,
				mrv: 20,
				recoveryDays: 2,
				frequencyMin: 2,
				frequencyMax: 4,
				trainingTips: null
			}
		];
		mockFrom.mockResolvedValue(muscles);

		const result = await getMuscles();
		expect(result).toEqual(muscles);
		expect(result).toHaveLength(2);
	});

	it('returns empty array when no muscles exist', async () => {
		mockFrom.mockResolvedValue([]);

		const result = await getMuscles();
		expect(result).toEqual([]);
	});
});

// ============ GET MUSCLE ============

describe('getMuscle', () => {
	beforeEach(resetChain);

	it('returns muscle by id', async () => {
		const mockMuscle = {
			id: 1,
			name: 'Chest',
			muscleGroup: 'chest',
			mv: 6,
			mev: 10,
			mavMin: 12,
			mavMax: 18,
			mrv: 22,
			recoveryDays: 2,
			frequencyMin: 2,
			frequencyMax: 3,
			trainingTips: null
		};
		mockWhere.mockResolvedValue([mockMuscle]);

		const result = await getMuscle(1);
		expect(result).toEqual(mockMuscle);
	});

	it('returns null when muscle not found', async () => {
		mockWhere.mockResolvedValue([]);

		const result = await getMuscle(999);
		expect(result).toBeNull();
	});

	it('returns null for empty result set', async () => {
		mockWhere.mockResolvedValue([]);

		const result = await getMuscle(0);
		expect(result).toBeNull();
	});
});

// ============ INSERT MUSCLE ============

describe('insertMuscle', () => {
	beforeEach(resetChain);

	it('creates and returns a new muscle', async () => {
		const created = {
			id: 3,
			name: 'Biceps',
			muscleGroup: 'arms',
			mv: 4,
			mev: 8,
			mavMin: 10,
			mavMax: 14,
			mrv: 20,
			recoveryDays: 1,
			frequencyMin: 2,
			frequencyMax: 3,
			trainingTips: null
		};
		const mockRet = vi.fn().mockResolvedValue([created]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockRet });
		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({ values: mockValues });

		const result = await insertMuscle({
			name: 'Biceps',
			muscleGroup: 'arms',
			mv: 4,
			mev: 8,
			mavMin: 10,
			mavMax: 14,
			mrv: 20,
			recoveryDays: 1,
			frequencyMin: 2,
			frequencyMax: 3,
			trainingTips: null
		});

		expect(result).toEqual(created);
		expect(result.name).toBe('Biceps');
		expect(result.id).toBe(3);
	});

	it('creates muscle with minimal data', async () => {
		const created = {
			id: 4,
			name: 'Calves',
			muscleGroup: 'legs',
			mv: null,
			mev: null,
			mavMin: null,
			mavMax: null,
			mrv: null,
			recoveryDays: null,
			frequencyMin: null,
			frequencyMax: null,
			trainingTips: null
		};
		const mockRet = vi.fn().mockResolvedValue([created]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockRet });
		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({ values: mockValues });

		const result = await insertMuscle({
			name: 'Calves',
			muscleGroup: 'legs',
			mv: null,
			mev: null,
			mavMin: null,
			mavMax: null,
			mrv: null,
			recoveryDays: null,
			frequencyMin: null,
			frequencyMax: null,
			trainingTips: null
		});

		expect(result).toEqual(created);
		expect(result.name).toBe('Calves');
	});
});

// ============ UPDATE MUSCLE ============

describe('updateMuscle', () => {
	beforeEach(resetChain);

	it('updates muscle name', async () => {
		mockWhere.mockResolvedValue(undefined);

		await updateMuscle(1, { name: 'Pectorals' });
		expect(db.update).toHaveBeenCalled();
	});

	it('updates multiple fields', async () => {
		mockWhere.mockResolvedValue(undefined);

		await updateMuscle(1, { name: 'Updated', mev: 12, mavMin: 16, mavMax: 20 });
		expect(db.update).toHaveBeenCalled();
	});

	it('handles empty update data', async () => {
		mockWhere.mockResolvedValue(undefined);

		await updateMuscle(1, {});
		expect(db.update).toHaveBeenCalled();
	});
});

// ============ DELETE MUSCLE ============

describe('deleteMuscle', () => {
	beforeEach(resetChain);

	it('deletes muscle and returns deletedId', async () => {
		const mockRet = vi.fn().mockResolvedValue([{ deletedId: 1 }]);
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnValue({ returning: mockRet })
		});

		const result = await deleteMuscle(1);
		expect(result).toEqual({ deletedId: 1 });
	});

	it('returns null when muscle not found', async () => {
		const mockRet = vi.fn().mockResolvedValue([]);
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnValue({ returning: mockRet })
		});

		const result = await deleteMuscle(999);
		expect(result).toBeNull();
	});

	it('returns correct deletedId for specific muscle', async () => {
		const mockRet = vi.fn().mockResolvedValue([{ deletedId: 42 }]);
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnValue({ returning: mockRet })
		});

		const result = await deleteMuscle(42);
		expect(result).toEqual({ deletedId: 42 });
	});
});
