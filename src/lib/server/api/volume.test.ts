import type { MuscleThresholds, MuscleVolumeResult } from './volume';

import { it, vi, expect, describe, beforeEach } from 'vitest';

import { roundSets, buildSummary, calculateZone } from './volume';

// ============ UNIT TESTS FOR PURE FUNCTIONS ============

describe('calculateZone', () => {
	const defaultThresholds: MuscleThresholds = {
		mev: 10,
		mavMin: 12,
		mavMax: 18,
		mrv: 22
	};

	it('returns "under" when sets < MEV', () => {
		expect(calculateZone(5, defaultThresholds)).toBe('under');
		expect(calculateZone(9, defaultThresholds)).toBe('under');
		expect(calculateZone(0, defaultThresholds)).toBe('under');
	});

	it('returns "optimal" when sets >= MEV and <= MRV', () => {
		expect(calculateZone(10, defaultThresholds)).toBe('optimal');
		expect(calculateZone(15, defaultThresholds)).toBe('optimal');
		expect(calculateZone(22, defaultThresholds)).toBe('optimal');
	});

	it('returns "over" when sets > MRV', () => {
		expect(calculateZone(23, defaultThresholds)).toBe('over');
		expect(calculateZone(30, defaultThresholds)).toBe('over');
	});

	it('handles null MEV (cannot be "under")', () => {
		const thresholds: MuscleThresholds = { mev: null, mavMin: 12, mavMax: 18, mrv: 22 };
		expect(calculateZone(5, thresholds)).toBe('optimal');
	});

	it('handles null MRV (cannot be "over")', () => {
		const thresholds: MuscleThresholds = { mev: 10, mavMin: 12, mavMax: 18, mrv: null };
		expect(calculateZone(100, thresholds)).toBe('optimal');
	});

	it('handles all null thresholds (always optimal)', () => {
		const thresholds: MuscleThresholds = { mev: null, mavMin: null, mavMax: null, mrv: null };
		expect(calculateZone(0, thresholds)).toBe('optimal');
		expect(calculateZone(50, thresholds)).toBe('optimal');
	});

	it('handles boundary cases exactly at MEV', () => {
		expect(calculateZone(10, defaultThresholds)).toBe('optimal');
	});

	it('handles boundary cases exactly at MRV', () => {
		expect(calculateZone(22, defaultThresholds)).toBe('optimal');
	});
});

describe('roundSets', () => {
	it('rounds to nearest integer', () => {
		expect(roundSets(5.4)).toBe(5);
		expect(roundSets(5.5)).toBe(6);
		expect(roundSets(5.6)).toBe(6);
	});

	it('handles whole numbers', () => {
		expect(roundSets(10)).toBe(10);
	});

	it('handles zero', () => {
		expect(roundSets(0)).toBe(0);
	});
});

describe('buildSummary', () => {
	it('correctly categorizes muscles by zone', () => {
		const muscles: MuscleVolumeResult[] = [
			{
				muscleId: 1,
				muscleName: 'Chest',
				effectiveSets: 15,
				zone: 'optimal',
				thresholds: { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 }
			},
			{
				muscleId: 2,
				muscleName: 'Back',
				effectiveSets: 5,
				zone: 'under',
				thresholds: { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 }
			},
			{
				muscleId: 3,
				muscleName: 'Shoulders',
				effectiveSets: 25,
				zone: 'over',
				thresholds: { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 }
			}
		];

		const summary = buildSummary(muscles);

		expect(summary.totalMuscles).toBe(3);
		expect(summary.under).toEqual(['Back']);
		expect(summary.optimal).toEqual(['Chest']);
		expect(summary.over).toEqual(['Shoulders']);
	});

	it('handles empty input', () => {
		const summary = buildSummary([]);
		expect(summary.totalMuscles).toBe(0);
		expect(summary.under).toEqual([]);
		expect(summary.optimal).toEqual([]);
		expect(summary.over).toEqual([]);
	});

	it('handles all muscles in same zone', () => {
		const muscles: MuscleVolumeResult[] = [
			{
				muscleId: 1,
				muscleName: 'Chest',
				effectiveSets: 15,
				zone: 'optimal',
				thresholds: { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 }
			},
			{
				muscleId: 2,
				muscleName: 'Back',
				effectiveSets: 16,
				zone: 'optimal',
				thresholds: { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 }
			}
		];

		const summary = buildSummary(muscles);

		expect(summary.totalMuscles).toBe(2);
		expect(summary.under).toEqual([]);
		expect(summary.optimal).toEqual(['Chest', 'Back']);
		expect(summary.over).toEqual([]);
	});
});

// ============ INTEGRATION TESTS (with mocked DB) ============

// Mock the database module
vi.mock('../db', () => ({
	db: {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		innerJoin: vi.fn().mockReturnThis(),
		where: vi.fn()
	}
}));

// Import after mocking
import { db } from '../db';
import { calculateVolume, getMusclesWithThresholds, calculateVolumeFromExercises } from './volume';

// Mock data
const mockMuscles = [
	{ id: 1, name: 'Chest', mev: 10, mavMin: 12, mavMax: 18, mrv: 22 },
	{ id: 2, name: 'Back', mev: 10, mavMin: 14, mavMax: 20, mrv: 25 },
	{ id: 3, name: 'Triceps', mev: 6, mavMin: 8, mavMax: 14, mrv: 18 }
];

const mockExerciseMuscle = [
	{
		exerciseId: 1,
		muscleId: 1,
		weighting: 0.75,
		muscleName: 'Chest',
		mev: 10,
		mavMin: 12,
		mavMax: 18,
		mrv: 22
	},
	{
		exerciseId: 1,
		muscleId: 3,
		weighting: 0.25,
		muscleName: 'Triceps',
		mev: 6,
		mavMin: 8,
		mavMax: 14,
		mrv: 18
	}
];

describe('getMusclesWithThresholds', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns map of muscles with thresholds', async () => {
		// Setup mock chain - db.select().from(muscle) returns promise directly (no .where())
		const mockFrom = vi.fn().mockResolvedValue(mockMuscles);
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await getMusclesWithThresholds();

		expect(result.size).toBe(3);
		expect(result.get(1)).toEqual({
			name: 'Chest',
			thresholds: { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 }
		});
	});
});

describe('calculateVolumeFromExercises', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns empty map for empty input', async () => {
		const result = await calculateVolumeFromExercises([]);
		expect(result.size).toBe(0);
	});

	it('calculates weighted volume from exercises', async () => {
		// Setup mock chain for the joined query
		const mockWhere = vi.fn().mockResolvedValue(mockExerciseMuscle);
		const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
		const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await calculateVolumeFromExercises([{ exerciseId: 1, sets: 4 }]);

		// 4 sets * 0.75 weighting = 3.0 effective sets for Chest
		expect(result.get(1)?.rawSets).toBe(3);
		// 4 sets * 0.25 weighting = 1.0 effective sets for Triceps
		expect(result.get(3)?.rawSets).toBe(1);
	});
});

describe('calculateVolume', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calculates volume from direct muscle input', async () => {
		// Setup mock for getMusclesWithThresholds
		const mockFrom = vi.fn().mockResolvedValue(mockMuscles);
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await calculateVolume({
			directVolume: [
				{ muscleId: 1, sets: 15 },
				{ muscleId: 2, sets: 8 }
			]
		});

		expect(result.muscles.length).toBe(2);
		expect(result.warnings.length).toBe(0);

		const chest = result.muscles.find((m) => m.muscleId === 1);
		expect(chest?.effectiveSets).toBe(15);
		expect(chest?.zone).toBe('optimal'); // 15 is between MEV (10) and MRV (22)

		const back = result.muscles.find((m) => m.muscleId === 2);
		expect(back?.effectiveSets).toBe(8);
		expect(back?.zone).toBe('under'); // 8 is below MEV (10)
	});

	it('generates warning for unknown muscle IDs', async () => {
		// Setup mock for getMusclesWithThresholds (only returns known muscles)
		const mockFrom = vi.fn().mockResolvedValue(mockMuscles);
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await calculateVolume({
			directVolume: [
				{ muscleId: 1, sets: 10 },
				{ muscleId: 999, sets: 5 } // Unknown muscle ID
			]
		});

		expect(result.muscles.length).toBe(1); // Only known muscle included
		expect(result.warnings.length).toBe(1);
		expect(result.warnings[0]).toEqual({
			type: 'unknown_muscle_id',
			message: 'Unknown muscle ID: 999. This muscle was skipped in calculations.',
			muscleId: 999
		});
	});

	it('generates multiple warnings for multiple unknown muscle IDs', async () => {
		const mockFrom = vi.fn().mockResolvedValue(mockMuscles);
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await calculateVolume({
			directVolume: [
				{ muscleId: 888, sets: 5 },
				{ muscleId: 999, sets: 5 }
			]
		});

		expect(result.muscles.length).toBe(0);
		expect(result.warnings.length).toBe(2);
		expect(result.warnings.map((w) => w.muscleId)).toEqual([888, 999]);
	});

	it('builds correct summary', async () => {
		const mockFrom = vi.fn().mockResolvedValue(mockMuscles);
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await calculateVolume({
			directVolume: [
				{ muscleId: 1, sets: 15 }, // optimal (10-22)
				{ muscleId: 2, sets: 8 }, // under (<10)
				{ muscleId: 3, sets: 20 } // over (>18)
			]
		});

		expect(result.summary.totalMuscles).toBe(3);
		expect(result.summary.optimal).toContain('Chest');
		expect(result.summary.under).toContain('Back');
		expect(result.summary.over).toContain('Triceps');
	});
});
