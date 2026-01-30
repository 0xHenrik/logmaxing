// seed-data.ts
// Comprehensive seed data based on Renaissance Periodization volume landmarks

export const muscles = [
	// Push muscles
	{ name: 'Chest', muscleGroup: 'Push' },
	{ name: 'Front Delts', muscleGroup: 'Push' },
	{ name: 'Side Delts', muscleGroup: 'Push' },
	{ name: 'Triceps', muscleGroup: 'Push' },

	// Pull muscles
	{ name: 'Back', muscleGroup: 'Pull' },
	{ name: 'Rear Delts', muscleGroup: 'Pull' },
	{ name: 'Biceps', muscleGroup: 'Pull' },
	{ name: 'Forearms', muscleGroup: 'Pull' },

	// Legs
	{ name: 'Quads', muscleGroup: 'Legs' },
	{ name: 'Hamstrings', muscleGroup: 'Legs' },
	{ name: 'Glutes', muscleGroup: 'Legs' },
	{ name: 'Calves', muscleGroup: 'Legs' },
	{ name: 'Adductors', muscleGroup: 'Legs' },

	// Core
	{ name: 'Abs', muscleGroup: 'Core' },
	{ name: 'Obliques', muscleGroup: 'Core' },

	// Other
	{ name: 'Traps', muscleGroup: 'Back' },
	{ name: 'Neck', muscleGroup: 'Other' }
] as const;

// Volume landmarks from RP (sets per week)
// MV = Maintenance Volume, MEV = Minimum Effective Volume
// MAV = Maximum Adaptive Volume (range), MRV = Maximum Recoverable Volume
export const volumeThresholds = [
	{ muscle: 'Chest', mv: 4, mev: 6, mavMin: 10, mavMax: 16, mrv: 22 },
	{ muscle: 'Front Delts', mv: 0, mev: 0, mavMin: 6, mavMax: 8, mrv: 12 }, // get lots from pressing
	{ muscle: 'Side Delts', mv: 6, mev: 8, mavMin: 16, mavMax: 22, mrv: 26 },
	{ muscle: 'Rear Delts', mv: 0, mev: 6, mavMin: 12, mavMax: 16, mrv: 22 },
	{ muscle: 'Triceps', mv: 4, mev: 6, mavMin: 10, mavMax: 14, mrv: 18 },
	{ muscle: 'Back', mv: 8, mev: 10, mavMin: 14, mavMax: 22, mrv: 25 },
	{ muscle: 'Biceps', mv: 6, mev: 8, mavMin: 14, mavMax: 20, mrv: 26 },
	{ muscle: 'Forearms', mv: 2, mev: 4, mavMin: 8, mavMax: 14, mrv: 20 },
	{ muscle: 'Quads', mv: 6, mev: 8, mavMin: 12, mavMax: 18, mrv: 22 },
	{ muscle: 'Hamstrings', mv: 4, mev: 6, mavMin: 10, mavMax: 16, mrv: 20 },
	{ muscle: 'Glutes', mv: 0, mev: 0, mavMin: 4, mavMax: 12, mrv: 16 },
	{ muscle: 'Calves', mv: 6, mev: 8, mavMin: 12, mavMax: 16, mrv: 20 },
	{ muscle: 'Abs', mv: 0, mev: 0, mavMin: 15, mavMax: 20, mrv: 25 },
	{ muscle: 'Traps', mv: 0, mev: 0, mavMin: 12, mavMax: 20, mrv: 26 },
	{ muscle: 'Adductors', mv: 4, mev: 6, mavMin: 8, mavMax: 14, mrv: 18 },
	{ muscle: 'Obliques', mv: 0, mev: 0, mavMin: 8, mavMax: 16, mrv: 20 },
	{ muscle: 'Neck', mv: 0, mev: 4, mavMin: 10, mavMax: 14, mrv: 20 }
] as const;

export const equipment = [
	{ name: 'Barbell' },
	{ name: 'Dumbbell' },
	{ name: 'EZ Bar' },
	{ name: 'Cable Machine' },
	{ name: 'Smith Machine' },
	{ name: 'Leg Press Machine' },
	{ name: 'Leg Extension Machine' },
	{ name: 'Leg Curl Machine' },
	{ name: 'Hack Squat Machine' },
	{ name: 'Chest Press Machine' },
	{ name: 'Pec Deck Machine' },
	{ name: 'Lat Pulldown Machine' },
	{ name: 'Seated Row Machine' },
	{ name: 'Shoulder Press Machine' },
	{ name: 'Preacher Curl Bench' },
	{ name: 'Pull-up Bar' },
	{ name: 'Dip Station' },
	{ name: 'Flat Bench' },
	{ name: 'Incline Bench' },
	{ name: 'Decline Bench' },
	{ name: 'Adjustable Bench' },
	{ name: 'Squat Rack' },
	{ name: 'Calf Raise Machine' },
	{ name: 'Hip Thrust Bench' },
	{ name: 'T-Bar Row' },
	{ name: 'Kettlebell' },
	{ name: 'Resistance Bands' },
	{ name: 'Ab Roller' },
	{ name: 'GHD Machine' },
	{ name: 'Bodyweight' }
] as const;

// Exercises with muscle activation data
// activationType: 'primary' = main target, 'secondary' = assists
// weighting: 1.0 = full set counts toward volume, 0.5 = half set, etc.
export const exercises = [
	// ==================== CHEST ====================
	{
		name: 'Barbell Bench Press',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Incline Barbell Press',
		equipment: ['Barbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Dumbbell Bench Press',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Incline Dumbbell Press',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Dumbbell Flye',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.2 }
		]
	},
	{
		name: 'Cable Flye',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.2 }
		]
	},
	{
		name: 'Machine Chest Press',
		equipment: ['Chest Press Machine'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Pec Deck Flye',
		equipment: ['Pec Deck Machine'],
		muscles: [{ muscle: 'Chest', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Push-up',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Dips (Chest)',
		equipment: ['Dip Station'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== BACK ====================
	{
		name: 'Barbell Row',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Dumbbell Row',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Pull-up',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Chin-up',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.7 }
		]
	},
	{
		name: 'Lat Pulldown',
		equipment: ['Lat Pulldown Machine'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Seated Cable Row',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'T-Bar Row',
		equipment: ['T-Bar Row'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.3 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Rack Pull',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Back', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== SHOULDERS ====================
	{
		name: 'Overhead Press',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.3 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Dumbbell Shoulder Press',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Lateral Raise',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Side Delts', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Cable Lateral Raise',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Side Delts', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Face Pull',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Reverse Pec Deck',
		equipment: ['Pec Deck Machine'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.2 }
		]
	},
	{
		name: 'Rear Delt Flye',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.2 }
		]
	},
	{
		name: 'Upright Row',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Machine Shoulder Press',
		equipment: ['Shoulder Press Machine'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.3 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== ARMS ====================
	{
		name: 'Barbell Curl',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Dumbbell Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Hammer Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Preacher Curl',
		equipment: ['EZ Bar', 'Preacher Curl Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Incline Dumbbell Curl',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Cable Curl',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.2 }
		]
	},
	{
		name: 'Spider Curl',
		equipment: ['EZ Bar', 'Incline Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Close Grip Bench Press',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Skull Crusher',
		equipment: ['EZ Bar', 'Flat Bench'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Tricep Pushdown',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Overhead Tricep Extension',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Dips (Triceps)',
		equipment: ['Dip Station'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Wrist Curl',
		equipment: ['Barbell'],
		muscles: [{ muscle: 'Forearms', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Reverse Curl',
		equipment: ['EZ Bar'],
		muscles: [
			{ muscle: 'Forearms', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== LEGS ====================
	{
		name: 'Barbell Back Squat',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Adductors', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Front Squat',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Leg Press',
		equipment: ['Leg Press Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Hack Squat',
		equipment: ['Hack Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Leg Extension',
		equipment: ['Leg Extension Machine'],
		muscles: [{ muscle: 'Quads', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Bulgarian Split Squat',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Lunges',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Romanian Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Back', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Lying Leg Curl',
		equipment: ['Leg Curl Machine'],
		muscles: [{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Seated Leg Curl',
		equipment: ['Leg Curl Machine'],
		muscles: [{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Stiff Leg Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Back', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Hip Thrust',
		equipment: ['Barbell', 'Hip Thrust Bench'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Glute Bridge',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Standing Calf Raise',
		equipment: ['Calf Raise Machine'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Seated Calf Raise',
		equipment: ['Calf Raise Machine'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Adductor Machine',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Adductors', activation: 'primary', weighting: 1.0 }]
	},

	// ==================== CORE ====================
	{
		name: 'Hanging Leg Raise',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Cable Crunch',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Ab Wheel Rollout',
		equipment: ['Ab Roller'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Plank',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 0.7 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Russian Twist',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Wood Chop',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== TRAPS ====================
	{
		name: 'Barbell Shrug',
		equipment: ['Barbell'],
		muscles: [{ muscle: 'Traps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Dumbbell Shrug',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Traps', activation: 'primary', weighting: 1.0 }]
	}
] as const;
