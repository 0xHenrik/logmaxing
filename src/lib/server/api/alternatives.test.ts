import { it, expect, describe } from 'vitest';

import {
	scoreForceProfile,
	scorePrimaryMuscles,
	calculateSimilarity,
	scoreMovementPattern,
	scoreStretchPosition,
	generateMatchReasons,
	scoreSecondaryMuscles
} from './alternatives';

// ============ MOCK DATA ============

const benchPressMuscles = [
	{ muscleId: 1, muscleName: 'Chest', activationType: 'primary', weighting: 1.0 },
	{ muscleId: 3, muscleName: 'Front Delts', activationType: 'secondary', weighting: 0.7 },
	{ muscleId: 5, muscleName: 'Triceps', activationType: 'secondary', weighting: 0.6 }
];

const dbBenchPressMuscles = [
	{ muscleId: 1, muscleName: 'Chest', activationType: 'primary', weighting: 1.0 },
	{ muscleId: 3, muscleName: 'Front Delts', activationType: 'secondary', weighting: 0.8 },
	{ muscleId: 5, muscleName: 'Triceps', activationType: 'secondary', weighting: 0.5 }
];

const overheadPressMuscles = [
	{ muscleId: 3, muscleName: 'Front Delts', activationType: 'primary', weighting: 1.0 },
	{ muscleId: 5, muscleName: 'Triceps', activationType: 'secondary', weighting: 0.6 },
	{ muscleId: 1, muscleName: 'Chest', activationType: 'secondary', weighting: 0.3 }
];

const barbellRowMuscles = [
	{ muscleId: 2, muscleName: 'Lats', activationType: 'primary', weighting: 1.0 },
	{ muscleId: 4, muscleName: 'Rear Delts', activationType: 'secondary', weighting: 0.6 },
	{ muscleId: 6, muscleName: 'Biceps', activationType: 'secondary', weighting: 0.5 }
];

// ============ scorePrimaryMuscles ============

describe('scorePrimaryMuscles', () => {
	it('returns 1.0 for identical primary muscles', () => {
		expect(scorePrimaryMuscles(benchPressMuscles, dbBenchPressMuscles)).toBe(1);
	});

	it('returns 0 for completely different primary muscles', () => {
		expect(scorePrimaryMuscles(benchPressMuscles, barbellRowMuscles)).toBe(0);
	});

	it('returns 0 for different primary muscles (bench vs overhead)', () => {
		expect(scorePrimaryMuscles(benchPressMuscles, overheadPressMuscles)).toBe(0);
	});

	it('returns 0 when source has no primary muscles', () => {
		const noPrimary = [
			{ muscleId: 1, muscleName: 'Chest', activationType: 'secondary', weighting: 0.5 }
		];
		expect(scorePrimaryMuscles(noPrimary, benchPressMuscles)).toBe(0);
	});

	it('returns 0 when candidate has no primary muscles', () => {
		const noPrimary = [
			{ muscleId: 1, muscleName: 'Chest', activationType: 'secondary', weighting: 0.5 }
		];
		expect(scorePrimaryMuscles(benchPressMuscles, noPrimary)).toBe(0);
	});

	it('returns 0 for empty muscle arrays', () => {
		expect(scorePrimaryMuscles([], [])).toBe(0);
	});
});

// ============ scoreSecondaryMuscles ============

describe('scoreSecondaryMuscles', () => {
	it('returns 1.0 for identical secondary muscles', () => {
		expect(scoreSecondaryMuscles(benchPressMuscles, dbBenchPressMuscles)).toBe(1);
	});

	it('returns partial score for overlapping secondaries', () => {
		// bench: Front Delts, Triceps (secondary)
		// overhead: Triceps, Chest (secondary)
		// intersection: Triceps (1), union: Front Delts, Triceps, Chest (3)
		const score = scoreSecondaryMuscles(benchPressMuscles, overheadPressMuscles);
		expect(score).toBeCloseTo(1 / 3, 2);
	});

	it('returns 0 for no secondary overlap', () => {
		expect(scoreSecondaryMuscles(benchPressMuscles, barbellRowMuscles)).toBe(0);
	});

	it('returns 1 when both have no secondary muscles', () => {
		const primaryOnly = [
			{ muscleId: 1, muscleName: 'Chest', activationType: 'primary', weighting: 1.0 }
		];
		expect(scoreSecondaryMuscles(primaryOnly, primaryOnly)).toBe(1);
	});

	it('returns 0 when only one has secondary muscles', () => {
		const primaryOnly = [
			{ muscleId: 1, muscleName: 'Chest', activationType: 'primary', weighting: 1.0 }
		];
		expect(scoreSecondaryMuscles(primaryOnly, benchPressMuscles)).toBe(0);
	});
});

// ============ scoreMovementPattern ============

describe('scoreMovementPattern', () => {
	it('returns 1.0 for exact match', () => {
		expect(scoreMovementPattern('horizontal_push', 'horizontal_push')).toBe(1);
		expect(scoreMovementPattern('squat', 'squat')).toBe(1);
	});

	it('returns 0.5 for same family (push)', () => {
		expect(scoreMovementPattern('horizontal_push', 'vertical_push')).toBe(0.5);
	});

	it('returns 0.5 for same family (pull)', () => {
		expect(scoreMovementPattern('horizontal_pull', 'vertical_pull')).toBe(0.5);
	});

	it('returns 0.5 for same family (hinge)', () => {
		expect(scoreMovementPattern('hip_hinge', 'squat')).toBe(0.5);
		expect(scoreMovementPattern('squat', 'lunge')).toBe(0.5);
		expect(scoreMovementPattern('hip_hinge', 'lunge')).toBe(0.5);
	});

	it('returns 0 for different families', () => {
		expect(scoreMovementPattern('horizontal_push', 'horizontal_pull')).toBe(0);
		expect(scoreMovementPattern('squat', 'vertical_push')).toBe(0);
	});

	it('returns 0 for isolation/carry/rotation (no family)', () => {
		expect(scoreMovementPattern('isolation', 'carry')).toBe(0);
		expect(scoreMovementPattern('rotation', 'isolation')).toBe(0);
	});

	it('returns 0 when either is null', () => {
		expect(scoreMovementPattern(null, 'squat')).toBe(0);
		expect(scoreMovementPattern('squat', null)).toBe(0);
		expect(scoreMovementPattern(null, null)).toBe(0);
	});
});

// ============ scoreForceProfile ============

describe('scoreForceProfile', () => {
	it('returns 1.0 for exact match', () => {
		expect(scoreForceProfile('ascending', 'ascending')).toBe(1);
		expect(scoreForceProfile('descending', 'descending')).toBe(1);
	});

	it('returns 0 for different profiles', () => {
		expect(scoreForceProfile('ascending', 'descending')).toBe(0);
		expect(scoreForceProfile('bell', 'constant')).toBe(0);
	});

	it('returns 0 when either is null', () => {
		expect(scoreForceProfile(null, 'ascending')).toBe(0);
		expect(scoreForceProfile('ascending', null)).toBe(0);
	});
});

// ============ scoreStretchPosition ============

describe('scoreStretchPosition', () => {
	it('returns 1.0 for exact match', () => {
		expect(scoreStretchPosition('lengthened', 'lengthened')).toBe(1);
		expect(scoreStretchPosition('mid', 'mid')).toBe(1);
	});

	it('returns 0 for different positions', () => {
		expect(scoreStretchPosition('lengthened', 'shortened')).toBe(0);
	});

	it('returns 0 when either is null', () => {
		expect(scoreStretchPosition(null, 'lengthened')).toBe(0);
	});
});

// ============ calculateSimilarity ============

describe('calculateSimilarity', () => {
	it('returns 1.0 for perfect match on all dimensions', () => {
		expect(
			calculateSimilarity({
				primaryMuscle: 1,
				secondaryMuscle: 1,
				movementPattern: 1,
				forceProfile: 1,
				stretchPosition: 1
			})
		).toBe(1);
	});

	it('returns 0 when all scores are 0', () => {
		expect(
			calculateSimilarity({
				primaryMuscle: 0,
				secondaryMuscle: 0,
				movementPattern: 0,
				forceProfile: 0,
				stretchPosition: 0
			})
		).toBe(0);
	});

	it('weights primary muscle at 40%', () => {
		const score = calculateSimilarity({
			primaryMuscle: 1,
			secondaryMuscle: 0,
			movementPattern: 0,
			forceProfile: 0,
			stretchPosition: 0
		});
		expect(score).toBe(0.4);
	});

	it('weights movement pattern at 20%', () => {
		const score = calculateSimilarity({
			primaryMuscle: 0,
			secondaryMuscle: 0,
			movementPattern: 1,
			forceProfile: 0,
			stretchPosition: 0
		});
		expect(score).toBe(0.2);
	});

	it('calculates weighted sum correctly', () => {
		const score = calculateSimilarity({
			primaryMuscle: 1,
			secondaryMuscle: 0.5,
			movementPattern: 1,
			forceProfile: 0,
			stretchPosition: 1
		});
		// 1*0.4 + 0.5*0.2 + 1*0.2 + 0*0.1 + 1*0.1 = 0.4 + 0.1 + 0.2 + 0 + 0.1 = 0.8
		expect(score).toBe(0.8);
	});
});

// ============ generateMatchReasons ============

describe('generateMatchReasons', () => {
	const sourceExercise = {
		id: 1,
		name: 'Barbell Bench Press',
		difficulty: 'intermediate',
		movementPattern: 'horizontal_push',
		forceProfile: 'ascending',
		stretchPosition: 'lengthened',
		muscles: benchPressMuscles,
		equipment: []
	};

	it('includes primary muscle reason when score > 0', () => {
		const reasons = generateMatchReasons(
			{
				primaryMuscle: 1,
				secondaryMuscle: 0,
				movementPattern: 0,
				forceProfile: 0,
				stretchPosition: 0
			},
			sourceExercise
		);
		expect(reasons).toContain('Same primary muscle (Chest)');
	});

	it('includes movement pattern reason for exact match', () => {
		const reasons = generateMatchReasons(
			{
				primaryMuscle: 0,
				secondaryMuscle: 0,
				movementPattern: 1,
				forceProfile: 0,
				stretchPosition: 0
			},
			sourceExercise
		);
		expect(reasons).toContain('Same movement pattern');
	});

	it('includes related movement pattern reason for partial match', () => {
		const reasons = generateMatchReasons(
			{
				primaryMuscle: 0,
				secondaryMuscle: 0,
				movementPattern: 0.5,
				forceProfile: 0,
				stretchPosition: 0
			},
			sourceExercise
		);
		expect(reasons).toContain('Related movement pattern');
	});

	it('includes force profile reason for match', () => {
		const reasons = generateMatchReasons(
			{
				primaryMuscle: 0,
				secondaryMuscle: 0,
				movementPattern: 0,
				forceProfile: 1,
				stretchPosition: 0
			},
			sourceExercise
		);
		expect(reasons).toContain('Same force profile (ascending)');
	});

	it('includes stretch position reason for lengthened match', () => {
		const reasons = generateMatchReasons(
			{
				primaryMuscle: 0,
				secondaryMuscle: 0,
				movementPattern: 0,
				forceProfile: 0,
				stretchPosition: 1
			},
			sourceExercise
		);
		expect(reasons).toContain('Lengthened stretch position');
	});

	it('returns empty array when no dimensions match', () => {
		const reasons = generateMatchReasons(
			{
				primaryMuscle: 0,
				secondaryMuscle: 0,
				movementPattern: 0,
				forceProfile: 0,
				stretchPosition: 0
			},
			sourceExercise
		);
		expect(reasons).toEqual([]);
	});
});
