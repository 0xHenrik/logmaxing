import type { MuscleThresholds, MuscleVolumeResult } from './volume';

import { it, expect, describe } from 'vitest';

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

// ============ INTEGRATION TESTS (require DB) ============
// These would be in a separate file or use test database

/*
describe('calculateVolume integration', () => {
  it('calculates volume from exercises correctly', async () => {
    // Requires test database with known exercise data
  });

  it('handles direct muscle input', async () => {
    // Requires test database with known muscle data
  });

  it('combines exercise and direct input', async () => {
    // Requires test database
  });
});
*/
