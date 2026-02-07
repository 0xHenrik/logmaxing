// ============ TYPES ============

export type TrainingSplit = 'push_pull_legs' | 'upper_lower' | 'full_body';

export type BlockType = 'accumulation' | 'intensification' | 'deload';

export type ProgressionScheme =
	| 'linear'
	| 'daily_undulating'
	| 'weekly_undulating'
	| 'block_periodization'
	| 'double_progression';

export type TargetLevel = 'beginner' | 'intermediate' | 'advanced';

export interface MuscleVolumeRecommendation {
	muscleName: string;
	muscleGroup: string;
	setsPerWeek: { min: number; max: number };
	sessionsPerWeek: number;
}

export interface DayTemplate {
	name: string;
	muscleGroups: string[];
	exerciseCount: { min: number; max: number };
	totalSets: { min: number; max: number };
	durationMinutes: { min: number; max: number };
}

export interface BlockTemplate {
	name: string;
	type: BlockType;
	durationWeeks: number;
	description: string;
	intensityGuidelines: string;
	volumeGuidelines: string;
}

export interface PeriodizationTemplate {
	id: string;
	name: string;
	description: string;
	split: TrainingSplit;
	daysPerWeek: number;
	weeklySchedule: DayTemplate[];
	blocks: BlockTemplate[];
	progressionScheme: ProgressionScheme;
	volumeRecommendations: MuscleVolumeRecommendation[];
	targetLevel: TargetLevel;
	tags: string[];
}

export interface PeriodizationTemplateListItem {
	id: string;
	name: string;
	description: string;
	split: TrainingSplit;
	daysPerWeek: number;
	targetLevel: TargetLevel;
	tags: string[];
}

export interface PeriodizationFilters {
	split?: TrainingSplit;
	daysPerWeek?: number;
	targetLevel?: TargetLevel;
	tags?: string[];
}

// ============ TEMPLATE DATA ============

export const PERIODIZATION_TEMPLATES: PeriodizationTemplate[] = [
	// ---- 1. Full Body 3-Day (Beginner) ----
	{
		id: 'full_body_3day_beginner',
		name: 'Full Body (3 Days/Week) - Beginner Foundation',
		description:
			'Full body training 3x/week for beginners. High frequency per muscle group builds motor patterns and work capacity. Linear progression on compound lifts.',
		split: 'full_body',
		daysPerWeek: 3,
		weeklySchedule: [
			{
				name: 'Full Body A',
				muscleGroups: ['Chest', 'Lats', 'Quads', 'Hamstrings', 'Side Delts', 'Abs'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 14, max: 18 },
				durationMinutes: { min: 45, max: 60 }
			},
			{
				name: 'Full Body B',
				muscleGroups: ['Front Delts', 'Upper Back', 'Glutes', 'Triceps', 'Biceps', 'Calves'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 14, max: 18 },
				durationMinutes: { min: 45, max: 60 }
			},
			{
				name: 'Full Body C',
				muscleGroups: ['Chest', 'Lats', 'Quads', 'Hamstrings', 'Rear Delts', 'Abs'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 14, max: 18 },
				durationMinutes: { min: 45, max: 60 }
			}
		],
		blocks: [
			{
				name: 'Linear Progression',
				type: 'accumulation',
				durationWeeks: 6,
				description:
					'Focus on learning movement patterns and progressive overload. Add weight each session when possible.',
				intensityGuidelines: 'RPE 6-7. Keep 3-4 reps in reserve. Prioritize form over weight.',
				volumeGuidelines: 'Start at MEV. Add 1 set per muscle every 2 weeks if recovery allows.'
			},
			{
				name: 'Deload',
				type: 'deload',
				durationWeeks: 1,
				description: 'Reduce volume and intensity to allow recovery and adaptation.',
				intensityGuidelines: 'RPE 4-5. Very easy. Focus purely on technique.',
				volumeGuidelines: '50% of normal volume.'
			}
		],
		progressionScheme: 'linear',
		volumeRecommendations: [
			{
				muscleName: 'Chest',
				muscleGroup: 'Push',
				setsPerWeek: { min: 6, max: 10 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Front Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 0, max: 6 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Side Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 8, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Triceps',
				muscleGroup: 'Push',
				setsPerWeek: { min: 6, max: 10 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Lats',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Upper Back',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 8, max: 12 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Rear Delts',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 6, max: 12 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Biceps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Quads',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 8, max: 12 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Hamstrings',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 6, max: 10 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Glutes',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 0, max: 4 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Calves',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 8, max: 12 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Abs',
				muscleGroup: 'Core',
				setsPerWeek: { min: 0, max: 15 },
				sessionsPerWeek: 2
			}
		],
		targetLevel: 'beginner',
		tags: ['beginner', 'full_body', 'foundation', '3_days', 'linear_progression']
	},

	// ---- 2. Upper/Lower 4-Day (Intermediate) ----
	{
		id: 'upper_lower_4day_intermediate',
		name: 'Upper/Lower (4 Days/Week) - Balanced Hypertrophy',
		description:
			'4-day upper/lower split with 2x frequency per muscle group. Good balance of volume and recovery for intermediate lifters. Each muscle hit twice per week.',
		split: 'upper_lower',
		daysPerWeek: 4,
		weeklySchedule: [
			{
				name: 'Upper A (Strength)',
				muscleGroups: ['Chest', 'Lats', 'Front Delts', 'Triceps', 'Biceps'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 60, max: 75 }
			},
			{
				name: 'Lower A (Quad Focus)',
				muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs'],
				exerciseCount: { min: 5, max: 6 },
				totalSets: { min: 14, max: 20 },
				durationMinutes: { min: 55, max: 70 }
			},
			{
				name: 'Upper B (Hypertrophy)',
				muscleGroups: ['Chest', 'Upper Back', 'Side Delts', 'Rear Delts', 'Triceps', 'Biceps'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 18, max: 24 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Lower B (Posterior Focus)',
				muscleGroups: ['Hamstrings', 'Glutes', 'Quads', 'Calves', 'Abs'],
				exerciseCount: { min: 5, max: 6 },
				totalSets: { min: 14, max: 20 },
				durationMinutes: { min: 55, max: 70 }
			}
		],
		blocks: [
			{
				name: 'Accumulation',
				type: 'accumulation',
				durationWeeks: 4,
				description:
					'Build volume tolerance and work capacity. Progressive overload through sets and reps before increasing weight.',
				intensityGuidelines: 'RPE 7-8. Leave 2-3 reps in reserve.',
				volumeGuidelines: 'Start at MEV, increase by 1-2 sets per muscle per week toward MAV.'
			},
			{
				name: 'Intensification',
				type: 'intensification',
				durationWeeks: 3,
				description:
					'Increase intensity while slightly reducing volume. Focus on strength gains and progressive overload.',
				intensityGuidelines: 'RPE 8-9. Leave 1-2 reps in reserve.',
				volumeGuidelines: 'Maintain near MAV. Prioritize adding weight over adding sets.'
			},
			{
				name: 'Deload',
				type: 'deload',
				durationWeeks: 1,
				description:
					'Active recovery. Maintain frequency but drastically cut volume and intensity.',
				intensityGuidelines: 'RPE 5-6. Very light.',
				volumeGuidelines: '40-50% of normal volume. Keep all exercises but reduce sets.'
			}
		],
		progressionScheme: 'block_periodization',
		volumeRecommendations: [
			{
				muscleName: 'Chest',
				muscleGroup: 'Push',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Front Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 0, max: 8 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Side Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 12, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Triceps',
				muscleGroup: 'Push',
				setsPerWeek: { min: 10, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Lats',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 12, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Upper Back',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Rear Delts',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Biceps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Quads',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Hamstrings',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Glutes',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 2, max: 10 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Calves',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 10, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Abs',
				muscleGroup: 'Core',
				setsPerWeek: { min: 6, max: 16 },
				sessionsPerWeek: 2
			}
		],
		targetLevel: 'intermediate',
		tags: ['intermediate', 'upper_lower', 'hypertrophy', '4_days', 'balanced']
	},

	// ---- 3. PPL 6-Day (Intermediate) ----
	{
		id: 'ppl_6day_hypertrophy',
		name: 'Push/Pull/Legs (6 Days/Week) - Hypertrophy Focus',
		description:
			'Classic PPL split run twice per week. High frequency (2x per muscle) with high total volume. Optimized for muscle growth with MAV-range targets.',
		split: 'push_pull_legs',
		daysPerWeek: 6,
		weeklySchedule: [
			{
				name: 'Push A (Chest Focus)',
				muscleGroups: ['Chest', 'Front Delts', 'Triceps', 'Side Delts'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Pull A (Back Width)',
				muscleGroups: ['Lats', 'Upper Back', 'Rear Delts', 'Biceps', 'Forearms'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Legs A (Quad Focus)',
				muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Push B (Shoulder Focus)',
				muscleGroups: ['Front Delts', 'Chest', 'Triceps', 'Side Delts'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Pull B (Back Thickness)',
				muscleGroups: ['Upper Back', 'Lats', 'Rear Delts', 'Biceps', 'Traps'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Legs B (Posterior Focus)',
				muscleGroups: ['Hamstrings', 'Glutes', 'Quads', 'Calves', 'Abs'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 60, max: 80 }
			}
		],
		blocks: [
			{
				name: 'Accumulation',
				type: 'accumulation',
				durationWeeks: 4,
				description:
					'Build volume progressively from MEV toward MAV. Focus on controlled reps and mind-muscle connection.',
				intensityGuidelines: 'RPE 7-8. Leave 2-3 reps in reserve on compounds, 1-2 on isolations.',
				volumeGuidelines: 'Start at MEV, add 1-2 sets per muscle per week. Target MAV by week 4.'
			},
			{
				name: 'Intensification',
				type: 'intensification',
				durationWeeks: 2,
				description:
					'Push toward MRV for a brief overreaching phase. Intensity up, fatigue peaks before deload.',
				intensityGuidelines: 'RPE 8-9. Push close to failure on isolations, 1 RIR on compounds.',
				volumeGuidelines: 'Maintain or slightly exceed MAV. Reduce if recovery is compromised.'
			},
			{
				name: 'Deload',
				type: 'deload',
				durationWeeks: 1,
				description:
					'Essential recovery. Maintain frequency and exercise selection but slash volume.',
				intensityGuidelines: 'RPE 5-6. Light, easy sessions.',
				volumeGuidelines: '40-50% of peak volume.'
			}
		],
		progressionScheme: 'block_periodization',
		volumeRecommendations: [
			{
				muscleName: 'Chest',
				muscleGroup: 'Push',
				setsPerWeek: { min: 10, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Front Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 0, max: 8 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Side Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 14, max: 22 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Triceps',
				muscleGroup: 'Push',
				setsPerWeek: { min: 10, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Lats',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 14, max: 22 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Upper Back',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 12, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Rear Delts',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Biceps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 12, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Traps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 6, max: 16 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Forearms',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 4, max: 10 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Quads',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 12, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Hamstrings',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Glutes',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 4, max: 12 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Calves',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 12, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Abs',
				muscleGroup: 'Core',
				setsPerWeek: { min: 8, max: 18 },
				sessionsPerWeek: 2
			}
		],
		targetLevel: 'intermediate',
		tags: ['intermediate', 'ppl', 'hypertrophy', '6_days', 'high_volume']
	},

	// ---- 4. PPL 6-Day (Advanced) ----
	{
		id: 'ppl_6day_advanced',
		name: 'Push/Pull/Legs (6 Days/Week) - Advanced High Volume',
		description:
			'High-frequency PPL for advanced lifters with 2+ years of training. Pushes closer to MRV with periodized intensity. Includes specialization options for lagging body parts.',
		split: 'push_pull_legs',
		daysPerWeek: 6,
		weeklySchedule: [
			{
				name: 'Push A (Heavy Compounds)',
				muscleGroups: ['Chest', 'Front Delts', 'Triceps', 'Side Delts'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 20, max: 26 },
				durationMinutes: { min: 70, max: 90 }
			},
			{
				name: 'Pull A (Heavy Compounds)',
				muscleGroups: ['Lats', 'Upper Back', 'Rear Delts', 'Biceps', 'Forearms'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 20, max: 26 },
				durationMinutes: { min: 70, max: 90 }
			},
			{
				name: 'Legs A (Quad Emphasis)',
				muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 20, max: 26 },
				durationMinutes: { min: 70, max: 90 }
			},
			{
				name: 'Push B (Hypertrophy Isolation)',
				muscleGroups: ['Chest', 'Side Delts', 'Triceps', 'Front Delts'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 20, max: 26 },
				durationMinutes: { min: 70, max: 90 }
			},
			{
				name: 'Pull B (Hypertrophy Isolation)',
				muscleGroups: ['Upper Back', 'Lats', 'Rear Delts', 'Biceps', 'Traps'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 20, max: 26 },
				durationMinutes: { min: 70, max: 90 }
			},
			{
				name: 'Legs B (Posterior Emphasis)',
				muscleGroups: ['Hamstrings', 'Glutes', 'Quads', 'Calves', 'Abs'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 20, max: 26 },
				durationMinutes: { min: 70, max: 90 }
			}
		],
		blocks: [
			{
				name: 'Accumulation',
				type: 'accumulation',
				durationWeeks: 3,
				description:
					'Ramp volume from MAV toward MRV. Focus on adding sets week-to-week while maintaining quality.',
				intensityGuidelines: 'RPE 7-8. 2-3 RIR on compounds, 1-2 RIR on isolations.',
				volumeGuidelines: 'Start at MAV. Add 2 sets per muscle per week toward MRV.'
			},
			{
				name: 'Overreach',
				type: 'intensification',
				durationWeeks: 2,
				description:
					'Brief functional overreach. Volume at or slightly above MRV. Expect temporary performance decline.',
				intensityGuidelines: 'RPE 8-9. 1 RIR on compounds, 0-1 RIR on isolations.',
				volumeGuidelines: 'At or slightly above MRV. This is intentionally unsustainable.'
			},
			{
				name: 'Deload',
				type: 'deload',
				durationWeeks: 1,
				description: 'Critical recovery. Supercompensation occurs during this week. Do not skip.',
				intensityGuidelines: 'RPE 5-6. Light and easy.',
				volumeGuidelines: '40-50% of peak volume. Maintain all exercises at reduced sets.'
			}
		],
		progressionScheme: 'block_periodization',
		volumeRecommendations: [
			{
				muscleName: 'Chest',
				muscleGroup: 'Push',
				setsPerWeek: { min: 14, max: 22 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Front Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 0, max: 10 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Side Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 16, max: 24 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Triceps',
				muscleGroup: 'Push',
				setsPerWeek: { min: 12, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Lats',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 16, max: 24 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Upper Back',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 14, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Rear Delts',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 12, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Biceps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 14, max: 24 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Traps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 8, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Forearms',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 4, max: 14 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Quads',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 14, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Hamstrings',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 12, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Glutes',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 6, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Calves',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 12, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Abs',
				muscleGroup: 'Core',
				setsPerWeek: { min: 10, max: 20 },
				sessionsPerWeek: 2
			}
		],
		targetLevel: 'advanced',
		tags: ['advanced', 'ppl', 'hypertrophy', '6_days', 'high_volume', 'overreach']
	},

	// ---- 5. Bro Split 5-Day ----
	{
		id: 'bro_split_5day',
		name: 'Body Part Split (5 Days/Week) - Classic Bodybuilding',
		description:
			'Traditional bodybuilding split training each muscle group once per week with high volume per session. Each day dedicated to one or two muscle groups for maximum pump and focus.',
		split: 'push_pull_legs' as TrainingSplit,
		daysPerWeek: 5,
		weeklySchedule: [
			{
				name: 'Chest',
				muscleGroups: ['Chest', 'Abs'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 50, max: 70 }
			},
			{
				name: 'Back',
				muscleGroups: ['Lats', 'Upper Back', 'Lower Back', 'Traps'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 18, max: 24 },
				durationMinutes: { min: 55, max: 75 }
			},
			{
				name: 'Shoulders & Arms',
				muscleGroups: ['Front Delts', 'Side Delts', 'Rear Delts', 'Biceps', 'Triceps'],
				exerciseCount: { min: 7, max: 9 },
				totalSets: { min: 20, max: 26 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Legs (Quads & Calves)',
				muscleGroups: ['Quads', 'Calves', 'Adductors'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 55, max: 75 }
			},
			{
				name: 'Legs (Posterior) & Abs',
				muscleGroups: ['Hamstrings', 'Glutes', 'Calves', 'Abs'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 22 },
				durationMinutes: { min: 55, max: 75 }
			}
		],
		blocks: [
			{
				name: 'Accumulation',
				type: 'accumulation',
				durationWeeks: 4,
				description:
					'Build volume within each session. High per-session volume compensates for 1x weekly frequency.',
				intensityGuidelines: 'RPE 7-9. Moderate to high intensity with pump focus.',
				volumeGuidelines:
					'All weekly volume in one session per muscle. Start at MEV, progress toward MAV.'
			},
			{
				name: 'Intensification',
				type: 'intensification',
				durationWeeks: 3,
				description:
					'Increase intensity while maintaining high per-session volume. Push toward failure on isolations.',
				intensityGuidelines: 'RPE 8-9. 1 RIR on compounds, close to failure on isolations.',
				volumeGuidelines: 'Maintain near MAV. Add intensity techniques (drop sets, rest-pause).'
			},
			{
				name: 'Deload',
				type: 'deload',
				durationWeeks: 1,
				description: 'Reduce volume and intensity. Maintain the same split structure.',
				intensityGuidelines: 'RPE 5-6. Light sessions.',
				volumeGuidelines: '50% of normal volume.'
			}
		],
		progressionScheme: 'block_periodization',
		volumeRecommendations: [
			{
				muscleName: 'Chest',
				muscleGroup: 'Push',
				setsPerWeek: { min: 10, max: 20 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Front Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 0, max: 8 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Side Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 10, max: 20 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Triceps',
				muscleGroup: 'Push',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Lats',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 12, max: 22 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Upper Back',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 18 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Rear Delts',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 8, max: 16 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Biceps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 20 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Traps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 6, max: 16 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Quads',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 10, max: 18 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Hamstrings',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 8, max: 16 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Glutes',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 4, max: 12 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Calves',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Abs',
				muscleGroup: 'Core',
				setsPerWeek: { min: 8, max: 18 },
				sessionsPerWeek: 2
			}
		],
		targetLevel: 'intermediate',
		tags: ['intermediate', 'body_part_split', 'bodybuilding', '5_days', 'classic']
	},

	// ---- 6. Arnold Split 6-Day ----
	{
		id: 'arnold_split_6day',
		name: 'Arnold Split (6 Days/Week) - Chest/Back, Shoulders/Arms, Legs',
		description:
			'Arnold Schwarzenegger-style training split. Pairs antagonist muscle groups for supersets and high training density. Each muscle hit 2x per week.',
		split: 'push_pull_legs' as TrainingSplit,
		daysPerWeek: 6,
		weeklySchedule: [
			{
				name: 'Chest & Back A',
				muscleGroups: ['Chest', 'Lats', 'Upper Back'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 18, max: 24 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Shoulders & Arms A',
				muscleGroups: ['Front Delts', 'Side Delts', 'Rear Delts', 'Biceps', 'Triceps'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 18, max: 24 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Legs A (Quad Focus)',
				muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 18, max: 24 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Chest & Back B',
				muscleGroups: ['Chest', 'Lats', 'Upper Back', 'Traps'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 18, max: 24 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Shoulders & Arms B',
				muscleGroups: ['Side Delts', 'Rear Delts', 'Front Delts', 'Biceps', 'Triceps', 'Forearms'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 18, max: 24 },
				durationMinutes: { min: 60, max: 80 }
			},
			{
				name: 'Legs B (Posterior Focus)',
				muscleGroups: ['Hamstrings', 'Glutes', 'Quads', 'Calves', 'Abs'],
				exerciseCount: { min: 6, max: 8 },
				totalSets: { min: 18, max: 24 },
				durationMinutes: { min: 60, max: 80 }
			}
		],
		blocks: [
			{
				name: 'Accumulation',
				type: 'accumulation',
				durationWeeks: 4,
				description:
					'Build volume using antagonist supersets for time efficiency. Pair chest/back and biceps/triceps exercises.',
				intensityGuidelines:
					'RPE 7-8. Focus on pump and mind-muscle connection. Use supersets aggressively.',
				volumeGuidelines:
					'Start at MEV, progress toward MAV. Supersets allow high volume in less time.'
			},
			{
				name: 'Intensification',
				type: 'intensification',
				durationWeeks: 3,
				description:
					'Increase loads on compounds while maintaining superset structure for isolations.',
				intensityGuidelines: 'RPE 8-9. Heavier on compounds, pump-focused on isolations.',
				volumeGuidelines: 'Maintain near MAV. Increase intensity rather than volume.'
			},
			{
				name: 'Deload',
				type: 'deload',
				durationWeeks: 1,
				description: 'Reduce volume substantially. Keep the split structure for consistency.',
				intensityGuidelines: 'RPE 5-6. Light weights, focus on movement quality.',
				volumeGuidelines: '40-50% of normal volume.'
			}
		],
		progressionScheme: 'block_periodization',
		volumeRecommendations: [
			{
				muscleName: 'Chest',
				muscleGroup: 'Push',
				setsPerWeek: { min: 12, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Front Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 0, max: 8 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Side Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 12, max: 22 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Triceps',
				muscleGroup: 'Push',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Lats',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 12, max: 22 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Upper Back',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Rear Delts',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Biceps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 12, max: 20 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Traps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 6, max: 16 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Forearms',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 4, max: 12 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Quads',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 10, max: 18 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Hamstrings',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 8, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Glutes',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 4, max: 12 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Calves',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Abs',
				muscleGroup: 'Core',
				setsPerWeek: { min: 8, max: 18 },
				sessionsPerWeek: 2
			}
		],
		targetLevel: 'intermediate',
		tags: ['intermediate', 'arnold_split', 'bodybuilding', '6_days', 'supersets', 'antagonist']
	},

	// ---- 7. Strength-Focused 4-Day ----
	{
		id: 'strength_4day',
		name: 'Strength (4 Days/Week) - Compound Focus',
		description:
			'Strength-focused 4-day program built around the big compound lifts. Uses linear and double progression on main lifts with hypertrophy accessory work. Suited for lifters wanting to get stronger on squat, bench, deadlift, and overhead press.',
		split: 'upper_lower',
		daysPerWeek: 4,
		weeklySchedule: [
			{
				name: 'Upper A (Bench Focus)',
				muscleGroups: ['Chest', 'Lats', 'Front Delts', 'Triceps', 'Biceps'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 20 },
				durationMinutes: { min: 60, max: 75 }
			},
			{
				name: 'Lower A (Squat Focus)',
				muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs'],
				exerciseCount: { min: 5, max: 6 },
				totalSets: { min: 14, max: 18 },
				durationMinutes: { min: 60, max: 75 }
			},
			{
				name: 'Upper B (OHP Focus)',
				muscleGroups: ['Front Delts', 'Chest', 'Upper Back', 'Triceps', 'Biceps'],
				exerciseCount: { min: 5, max: 7 },
				totalSets: { min: 16, max: 20 },
				durationMinutes: { min: 60, max: 75 }
			},
			{
				name: 'Lower B (Deadlift Focus)',
				muscleGroups: ['Hamstrings', 'Glutes', 'Quads', 'Lower Back', 'Abs'],
				exerciseCount: { min: 5, max: 6 },
				totalSets: { min: 14, max: 18 },
				durationMinutes: { min: 60, max: 75 }
			}
		],
		blocks: [
			{
				name: 'Base Building',
				type: 'accumulation',
				durationWeeks: 4,
				description:
					'Build work capacity and technique on main lifts. Moderate intensity with linear progression. Add weight each week.',
				intensityGuidelines: 'RPE 6-7 on main lifts (3-4 RIR). RPE 7-8 on accessories.',
				volumeGuidelines:
					'Lower volume per muscle than hypertrophy programs. Focus on quality sets on compounds. 3-5 sets on main lift, 2-3 sets on accessories.'
			},
			{
				name: 'Strength Peak',
				type: 'intensification',
				durationWeeks: 3,
				description:
					'Increase intensity on main lifts while reducing total volume. Work up to heavier singles, doubles, and triples.',
				intensityGuidelines: 'RPE 8-9 on main lifts (1-2 RIR). Reduce accessory intensity.',
				volumeGuidelines:
					'Reduce accessory volume by 20-30%. Main lift volume stays similar but at higher intensity (fewer reps, more weight).'
			},
			{
				name: 'Deload',
				type: 'deload',
				durationWeeks: 1,
				description:
					'Active recovery with light technique work. Test new maxes the following week if desired.',
				intensityGuidelines: 'RPE 5-6. Light technique work on main lifts.',
				volumeGuidelines: '50% of normal volume. 2-3 sets per exercise max.'
			}
		],
		progressionScheme: 'linear',
		volumeRecommendations: [
			{
				muscleName: 'Chest',
				muscleGroup: 'Push',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Front Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 0, max: 6 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Side Delts',
				muscleGroup: 'Push',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Triceps',
				muscleGroup: 'Push',
				setsPerWeek: { min: 6, max: 12 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Lats',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 10, max: 16 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Upper Back',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Rear Delts',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 6, max: 12 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Biceps',
				muscleGroup: 'Pull',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Quads',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Hamstrings',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 8, max: 14 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Glutes',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 2, max: 8 },
				sessionsPerWeek: 2
			},
			{
				muscleName: 'Calves',
				muscleGroup: 'Legs',
				setsPerWeek: { min: 8, max: 12 },
				sessionsPerWeek: 1
			},
			{
				muscleName: 'Abs',
				muscleGroup: 'Core',
				setsPerWeek: { min: 6, max: 14 },
				sessionsPerWeek: 2
			}
		],
		targetLevel: 'intermediate',
		tags: ['intermediate', 'upper_lower', 'strength', '4_days', 'compound_focus', 'powerbuilding']
	}
];

// ============ QUERY FUNCTIONS ============

function toListItem(t: PeriodizationTemplate): PeriodizationTemplateListItem {
	return {
		id: t.id,
		name: t.name,
		description: t.description,
		split: t.split,
		daysPerWeek: t.daysPerWeek,
		targetLevel: t.targetLevel,
		tags: t.tags
	};
}

export function getAllTemplates(): PeriodizationTemplateListItem[] {
	return PERIODIZATION_TEMPLATES.map(toListItem);
}

export function getTemplateById(id: string): PeriodizationTemplate | null {
	return PERIODIZATION_TEMPLATES.find((t) => t.id === id) ?? null;
}

export function filterTemplates(filters: PeriodizationFilters): PeriodizationTemplateListItem[] {
	let filtered = PERIODIZATION_TEMPLATES;

	if (filters.split) {
		filtered = filtered.filter((t) => t.split === filters.split);
	}

	if (filters.daysPerWeek) {
		filtered = filtered.filter((t) => t.daysPerWeek === filters.daysPerWeek);
	}

	if (filters.targetLevel) {
		filtered = filtered.filter((t) => t.targetLevel === filters.targetLevel);
	}

	if (filters.tags && filters.tags.length > 0) {
		filtered = filtered.filter((t) => filters.tags!.some((tag) => t.tags.includes(tag)));
	}

	return filtered.map(toListItem);
}
