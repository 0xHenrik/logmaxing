// seed-data.ts
// Simplified seed data with main muscle groups (not anatomical heads)
// Volume landmarks based on Renaissance Periodization guidelines
// EMG weightings based on ACE studies, Bret Contreras, and academic research

// ============ TYPE DEFINITIONS ============

// Difficulty levels for exercises
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Movement patterns - how the exercise moves through space
export type MovementPattern =
	| 'horizontal_push'
	| 'vertical_push'
	| 'horizontal_pull'
	| 'vertical_pull'
	| 'hip_hinge'
	| 'squat'
	| 'lunge'
	| 'isolation'
	| 'carry'
	| 'rotation';

// Planes of motion
export type Plane = 'sagittal' | 'frontal' | 'transverse' | 'multi';

// Where the exercise is hardest in the range of motion
export type ForceProfile = 'ascending' | 'descending' | 'bell' | 'constant';

// Where the muscle is loaded most (stretch-mediated hypertrophy)
export type StretchPosition = 'lengthened' | 'mid' | 'shortened';

// Stability requirements
export type StabilityDemand = 'high' | 'medium' | 'low';

// Grip types
export type GripType = 'overhand' | 'underhand' | 'neutral' | 'mixed' | 'none';

// ============ MUSCLES ============

// Muscles with volume landmarks from RP (sets per week for whole muscle group)
// MV = Maintenance Volume, MEV = Minimum Effective Volume
// MAV = Maximum Adaptive Volume (range), MRV = Maximum Recoverable Volume
export const muscles = [
	// Push muscles
	{
		name: 'Chest',
		muscleGroup: 'Push',
		mv: 4,
		mev: 6,
		mavMin: 10,
		mavMax: 16,
		mrv: 22,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 3,
		trainingTips: 'Responds well to stretch-focused movements like flyes. Full ROM important.'
	},
	{
		name: 'Front Delts',
		muscleGroup: 'Push',
		mv: 0,
		mev: 0,
		mavMin: 6,
		mavMax: 8,
		mrv: 12,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 3,
		trainingTips: 'Gets significant volume from pressing. Direct work often unnecessary.'
	},
	{
		name: 'Side Delts',
		muscleGroup: 'Push',
		mv: 6,
		mev: 8,
		mavMin: 16,
		mavMax: 22,
		mrv: 26,
		recoveryDays: 1,
		frequencyMin: 3,
		frequencyMax: 6,
		trainingTips: 'Recovers quickly, can train frequently. Responds to high volume.'
	},
	{
		name: 'Triceps',
		muscleGroup: 'Push',
		mv: 4,
		mev: 6,
		mavMin: 10,
		mavMax: 14,
		mrv: 18,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 3,
		trainingTips: 'Long head needs overhead work for full stretch.'
	},

	// Pull muscles
	{
		name: 'Lats',
		muscleGroup: 'Pull',
		mv: 8,
		mev: 10,
		mavMin: 14,
		mavMax: 22,
		mrv: 25,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 3,
		trainingTips: 'Full stretch at top of pulldowns/rows is important. Vary grip widths.'
	},
	{
		name: 'Upper Back',
		muscleGroup: 'Pull',
		mv: 6,
		mev: 8,
		mavMin: 12,
		mavMax: 18,
		mrv: 22,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 4,
		trainingTips: 'Focus on scapular retraction. Rows with elbows high target this well.'
	},
	{
		name: 'Rear Delts',
		muscleGroup: 'Pull',
		mv: 0,
		mev: 6,
		mavMin: 12,
		mavMax: 16,
		mrv: 22,
		recoveryDays: 1,
		frequencyMin: 3,
		frequencyMax: 6,
		trainingTips: 'Recovers quickly. Face pulls and reverse flyes are staples.'
	},
	{
		name: 'Biceps',
		muscleGroup: 'Pull',
		mv: 6,
		mev: 8,
		mavMin: 14,
		mavMax: 20,
		mrv: 26,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 4,
		trainingTips: 'Include incline curls for long head stretch. Variety of grips helps.'
	},
	{
		name: 'Forearms',
		muscleGroup: 'Pull',
		mv: 2,
		mev: 4,
		mavMin: 8,
		mavMax: 14,
		mrv: 20,
		recoveryDays: 1,
		frequencyMin: 2,
		frequencyMax: 4,
		trainingTips: 'Often trained indirectly. Direct work good for grip-focused goals.'
	},
	{
		name: 'Traps',
		muscleGroup: 'Pull',
		mv: 0,
		mev: 0,
		mavMin: 12,
		mavMax: 20,
		mrv: 26,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 4,
		trainingTips: 'Upper traps from shrugs, mid/lower from rows. Pause at top.'
	},

	// Legs
	{
		name: 'Quads',
		muscleGroup: 'Legs',
		mv: 6,
		mev: 8,
		mavMin: 12,
		mavMax: 18,
		mrv: 22,
		recoveryDays: 3,
		frequencyMin: 2,
		frequencyMax: 3,
		trainingTips: 'Deep ROM squats and leg press. Leg extensions for isolation.'
	},
	{
		name: 'Hamstrings',
		muscleGroup: 'Legs',
		mv: 4,
		mev: 6,
		mavMin: 10,
		mavMax: 16,
		mrv: 20,
		recoveryDays: 3,
		frequencyMin: 2,
		frequencyMax: 3,
		trainingTips: 'Need both hip extension (RDL) and knee flexion (leg curls) work.'
	},
	{
		name: 'Glutes',
		muscleGroup: 'Legs',
		mv: 0,
		mev: 0,
		mavMin: 4,
		mavMax: 12,
		mrv: 16,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 4,
		trainingTips: 'Hip thrusts at shortened position, RDLs at lengthened. Both patterns important.'
	},
	{
		name: 'Calves',
		muscleGroup: 'Legs',
		mv: 6,
		mev: 8,
		mavMin: 12,
		mavMax: 16,
		mrv: 20,
		recoveryDays: 1,
		frequencyMin: 3,
		frequencyMax: 6,
		trainingTips: 'High frequency works well. Full stretch at bottom, pause at top.'
	},
	{
		name: 'Adductors',
		muscleGroup: 'Legs',
		mv: 4,
		mev: 6,
		mavMin: 8,
		mavMax: 14,
		mrv: 18,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 3,
		trainingTips: 'Wide stance squats and dedicated machine work. Often undertrained.'
	},

	// Core
	{
		name: 'Abs',
		muscleGroup: 'Core',
		mv: 0,
		mev: 0,
		mavMin: 15,
		mavMax: 20,
		mrv: 25,
		recoveryDays: 1,
		frequencyMin: 3,
		frequencyMax: 6,
		trainingTips: 'Weighted exercises for hypertrophy. Full spinal flexion for peak contraction.'
	},
	{
		name: 'Obliques',
		muscleGroup: 'Core',
		mv: 0,
		mev: 0,
		mavMin: 8,
		mavMax: 16,
		mrv: 20,
		recoveryDays: 1,
		frequencyMin: 2,
		frequencyMax: 4,
		trainingTips:
			'Anti-rotation and rotation both work. Avoid heavy side bends if waist size matters.'
	},
	{
		name: 'Lower Back',
		muscleGroup: 'Core',
		mv: 4,
		mev: 6,
		mavMin: 10,
		mavMax: 16,
		mrv: 20,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 3,
		trainingTips: 'Back extensions are the staple. Often trained indirectly from deadlifts.'
	},

	// Other
	{
		name: 'Neck',
		muscleGroup: 'Other',
		mv: 0,
		mev: 4,
		mavMin: 10,
		mavMax: 14,
		mrv: 20,
		recoveryDays: 1,
		frequencyMin: 3,
		frequencyMax: 6,
		trainingTips: 'Train all directions - flexion, extension, lateral. Light weights, high reps.'
	}
] as const;

export const equipment = [
	// Free Weights
	{ name: 'Barbell' },
	{ name: 'Olympic Barbell' },
	{ name: 'Trap Bar (Hex Bar)' },
	{ name: 'EZ Curl Bar' },
	{ name: 'Swiss Bar (Football Bar)' },
	{ name: 'Safety Squat Bar' },
	{ name: 'Cambered Bar' },
	{ name: 'Dumbbell' },
	{ name: 'Kettlebell' },
	{ name: 'Weight Plates' },
	{ name: 'Medicine Ball' },
	{ name: 'Slam Ball' },

	// Benches
	{ name: 'Flat Bench' },
	{ name: 'Incline Bench' },
	{ name: 'Decline Bench' },
	{ name: 'Adjustable Bench' },
	{ name: 'Preacher Curl Bench' },
	{ name: 'Hip Thrust Bench' },
	{ name: 'Roman Chair' },

	// Racks & Stands
	{ name: 'Squat Rack' },
	{ name: 'Power Rack' },
	{ name: 'Half Rack' },
	{ name: 'Dip Station' },
	{ name: 'Pull-up Bar' },
	{ name: 'Landmine Attachment' },

	// Cable Machines
	{ name: 'Cable Machine' },
	{ name: 'Dual Cable Crossover' },
	{ name: 'Functional Trainer' },

	// Plate-Loaded Machines
	{ name: 'Smith Machine' },
	{ name: 'Leg Press Machine' },
	{ name: 'Hack Squat Machine' },
	{ name: 'V-Squat Machine' },
	{ name: 'Pendulum Squat Machine' },
	{ name: 'Belt Squat Machine' },
	{ name: 'Chest Press Machine' },
	{ name: 'Incline Chest Press Machine' },
	{ name: 'Shoulder Press Machine' },
	{ name: 'Lat Pulldown Machine' },
	{ name: 'Low Row Machine' },
	{ name: 'Seated Row Machine' },
	{ name: 'T-Bar Row Machine' },
	{ name: 'Rear Delt Machine' },
	{ name: 'Pec Deck Machine' },
	{ name: 'Tricep Dip Machine' },

	// Selectorized Machines
	{ name: 'Leg Extension Machine' },
	{ name: 'Leg Curl Machine (Lying)' },
	{ name: 'Leg Curl Machine (Seated)' },
	{ name: 'Hip Abductor Machine' },
	{ name: 'Hip Adductor Machine' },
	{ name: 'Glute Kickback Machine' },
	{ name: 'Calf Raise Machine (Standing)' },
	{ name: 'Calf Raise Machine (Seated)' },
	{ name: 'Calf Raise Machine (Donkey)' },
	{ name: 'Ab Crunch Machine' },
	{ name: 'Rotary Torso Machine' },
	{ name: 'Back Extension Machine' },
	{ name: 'GHD Machine (Glute Ham Developer)' },
	{ name: 'Reverse Hyper Machine' },
	{ name: 'Bicep Curl Machine' },
	{ name: 'Tricep Extension Machine' },

	// Bodyweight & Accessories
	{ name: 'Bodyweight' },
	{ name: 'Resistance Bands' },
	{ name: 'Suspension Trainer (TRX)' },
	{ name: 'Ab Wheel' },
	{ name: 'Parallettes' },
	{ name: 'Gymnastic Rings' },
	{ name: 'Bosu Ball' },
	{ name: 'Stability Ball' },
	{ name: 'Foam Roller' },

	// Cardio Equipment
	{ name: 'Rowing Machine' },
	{ name: 'Ski Erg' },
	{ name: 'Assault Bike' },
	{ name: 'Stairmaster' },
	{ name: 'Treadmill' },
	{ name: 'Sled' },
	{ name: 'Prowler Sled' },

	// Attachments
	{ name: 'Rope Attachment' },
	{ name: 'Straight Bar Attachment' },
	{ name: 'V-Bar Attachment' },
	{ name: 'D-Handle Attachment' },
	{ name: 'Lat Pulldown Bar' },
	{ name: 'MAG Grip' },
	{ name: 'Ankle Strap' },

	// Specialty
	{ name: 'Neck Harness' },
	{ name: 'Dip Belt' },
	{ name: 'Wrist Roller' },
	{ name: 'Fat Gripz' },
	{ name: 'Lifting Straps' },
	{ name: 'Wrist Wraps' }
] as const;

// ============ EXERCISES ============

// Exercise definitions with EMG-based muscle activation data
// activationType: 'primary' = main target, 'secondary' = synergist
// weighting: 1.0 = full set counts toward volume

// Biomechanics fields (optional - will be null if not provided):
// - difficulty: beginner | intermediate | advanced
// - movementPattern: horizontal_push | vertical_push | horizontal_pull | vertical_pull | hip_hinge | squat | lunge | isolation | carry | rotation
// - plane: sagittal | frontal | transverse | multi
// - forceProfile: ascending (hardest at lockout) | descending (hardest at stretch) | bell (hardest in middle) | constant
// - stretchPosition: lengthened | mid | shortened (where the target muscle is loaded)
// - stabilityDemand: high (free weights) | medium (dumbbells/cables) | low (machines)
// - unilateral: true for single-arm/leg movements
// - gripType: overhand | underhand | neutral | mixed | none

export const exercises = [
	// ==================== CHEST ====================
	{
		name: 'Barbell Bench Press',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 }
		],
		// Full biomechanics data (example)
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Lie on bench with eyes under the bar',
			'Grip bar slightly wider than shoulder width',
			'Unrack and position bar over chest',
			'Lower bar to mid-chest with elbows at 45-75 degrees',
			'Press bar up in a slight arc back to starting position'
		],
		tips: [
			'Keep shoulder blades retracted and depressed',
			'Maintain slight arch in lower back',
			'Touch chest without bouncing',
			'Drive feet into floor for leg drive'
		]
	},
	{
		name: 'Close-Grip Bench Press',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Wide-Grip Bench Press',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Incline Barbell Press',
		equipment: ['Barbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Decline Barbell Press',
		equipment: ['Barbell', 'Decline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Dumbbell Bench Press',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Incline Dumbbell Press',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Decline Dumbbell Press',
		equipment: ['Dumbbell', 'Decline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Dumbbell Flye',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Incline Dumbbell Flye',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Cable Crossover (High to Low)',
		equipment: ['Dual Cable Crossover'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Cable Crossover (Low to High)',
		equipment: ['Dual Cable Crossover'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Cable Flye (Mid)',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.25 }
		]
	},
	{
		name: 'Pec Deck Flye',
		equipment: ['Pec Deck Machine'],
		muscles: [{ muscle: 'Chest', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Machine Chest Press',
		equipment: ['Chest Press Machine'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Incline Machine Press',
		equipment: ['Incline Chest Press Machine'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Push-Up',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Weighted Dip (Chest)',
		equipment: ['Dip Station', 'Dip Belt'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.7 }
		]
	},
	{
		name: 'Landmine Press',
		equipment: ['Barbell', 'Landmine Attachment'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Smith Machine Bench Press',
		equipment: ['Smith Machine', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		]
	},

	// ==================== SHOULDERS ====================
	{
		name: 'Overhead Press',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Seated Dumbbell Shoulder Press',
		equipment: ['Dumbbell', 'Adjustable Bench'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Arnold Press',
		equipment: ['Dumbbell', 'Adjustable Bench'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Push Press',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Machine Shoulder Press',
		equipment: ['Shoulder Press Machine'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Dumbbell Lateral Raise',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Cable Lateral Raise',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.25 }
		]
	},
	{
		name: 'Machine Lateral Raise',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Side Delts', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Upright Row',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Dumbbell Upright Row',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Face Pull',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Reverse Pec Deck',
		equipment: ['Rear Delt Machine'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Bent-Over Dumbbell Reverse Flye',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Cable Reverse Flye',
		equipment: ['Dual Cable Crossover'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Dumbbell Front Raise',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Cable Front Raise',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Plate Front Raise',
		equipment: ['Weight Plates'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Lu Raise',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 }
		]
	},

	// ==================== TRICEPS ====================
	{
		name: 'Tricep Pushdown',
		equipment: ['Cable Machine', 'Straight Bar Attachment'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Rope Tricep Pushdown',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Overhead Tricep Extension (Cable)',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Dumbbell Overhead Tricep Extension',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Skull Crushers',
		equipment: ['EZ Curl Bar', 'Flat Bench'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Dumbbell Skull Crushers',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Tricep Dip',
		equipment: ['Dip Station'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Bench Dip',
		equipment: ['Flat Bench'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Diamond Push-Up',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Tricep Kickback',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 0.95 }]
	},
	{
		name: 'Tricep Cable Kickback',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 0.95 }]
	},
	{
		name: 'Machine Tricep Extension',
		equipment: ['Tricep Extension Machine'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'JM Press',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== BACK (LATS) ====================
	{
		name: 'Pull-Up',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Chin-Up',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Weighted Pull-Up',
		equipment: ['Pull-up Bar', 'Dip Belt'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Lat Pulldown',
		equipment: ['Lat Pulldown Machine', 'Lat Pulldown Bar'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Close-Grip Lat Pulldown',
		equipment: ['Lat Pulldown Machine', 'V-Bar Attachment'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Wide-Grip Lat Pulldown',
		equipment: ['Lat Pulldown Machine', 'Lat Pulldown Bar'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Straight-Arm Pulldown',
		equipment: ['Cable Machine', 'Straight Bar Attachment'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Barbell Row',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Upper Back', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Pendlay Row',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Upper Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Lats', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Dumbbell Row',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Chest-Supported Row',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'T-Bar Row',
		equipment: ['T-Bar Row Machine'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Seated Cable Row',
		equipment: ['Seated Row Machine', 'V-Bar Attachment'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Wide-Grip Seated Row',
		equipment: ['Seated Row Machine', 'Lat Pulldown Bar'],
		muscles: [
			{ muscle: 'Upper Back', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.45 }
		]
	},
	{
		name: 'Meadows Row',
		equipment: ['Barbell', 'Landmine Attachment'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Kroc Row',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Machine Row',
		equipment: ['Low Row Machine'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Seal Row',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Inverted Row',
		equipment: ['Bodyweight', 'Squat Rack'],
		muscles: [
			{ muscle: 'Upper Back', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.5 }
		]
	},

	// ==================== TRAPS ====================
	{
		name: 'Barbell Shrug',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Traps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Dumbbell Shrug',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Traps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Trap Bar Shrug',
		equipment: ['Trap Bar (Hex Bar)'],
		muscles: [
			{ muscle: 'Traps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Cable Shrug',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Traps', activation: 'primary', weighting: 0.95 }]
	},
	{
		name: 'Farmers Walk',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Traps', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== BICEPS ====================
	{
		name: 'Barbell Curl',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'EZ Bar Curl',
		equipment: ['EZ Curl Bar'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Dumbbell Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Incline Dumbbell Curl',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		],
		// Full biomechanics data (example - stretch-focused isolation)
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'descending' as const, // Hardest at bottom (stretched position)
		stretchPosition: 'lengthened' as const, // Biceps fully stretched at bottom
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Set bench to 45-60 degree incline',
			'Sit back with arms hanging straight down',
			'Keep upper arms stationary throughout',
			'Curl weights up while supinating forearms',
			'Lower under control to full stretch'
		],
		tips: [
			'Let arms hang completely at the bottom',
			'Avoid swinging or using momentum',
			'Focus on the stretch at the bottom',
			'Control the negative for maximum tension'
		]
	},
	{
		name: 'Hammer Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Preacher Curl',
		equipment: ['EZ Curl Bar', 'Preacher Curl Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Dumbbell Preacher Curl',
		equipment: ['Dumbbell', 'Preacher Curl Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Cable Curl',
		equipment: ['Cable Machine', 'Straight Bar Attachment'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Rope Hammer Curl',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Concentration Curl',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Spider Curl',
		equipment: ['EZ Curl Bar', 'Incline Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Machine Bicep Curl',
		equipment: ['Bicep Curl Machine'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Cross-Body Hammer Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Zottman Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.7 }
		]
	},

	// ==================== FOREARMS ====================
	{
		name: 'Wrist Curl',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [{ muscle: 'Forearms', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Reverse Wrist Curl',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [{ muscle: 'Forearms', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Reverse Curl',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Forearms', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Wrist Roller',
		equipment: ['Wrist Roller'],
		muscles: [{ muscle: 'Forearms', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Dead Hang',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Forearms', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.3 }
		]
	},

	// ==================== QUADS ====================
	{
		name: 'Barbell Back Squat',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'High Bar Squat',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Low Bar Squat',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.45 }
		]
	},
	{
		name: 'Front Squat',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Safety Bar Squat',
		equipment: ['Safety Squat Bar', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.45 }
		]
	},
	{
		name: 'Goblet Squat',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Leg Press',
		equipment: ['Leg Press Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Hack Squat',
		equipment: ['Hack Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'V-Squat',
		equipment: ['V-Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Pendulum Squat',
		equipment: ['Pendulum Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Belt Squat',
		equipment: ['Belt Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Smith Machine Squat',
		equipment: ['Smith Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Leg Extension',
		equipment: ['Leg Extension Machine'],
		muscles: [{ muscle: 'Quads', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Sissy Squat',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Quads', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Bulgarian Split Squat',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Walking Lunge',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Reverse Lunge',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Step-Up',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 }
		]
	},

	// ==================== HAMSTRINGS ====================
	{
		name: 'Romanian Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.55 }
		]
	},
	{
		name: 'Dumbbell Romanian Deadlift',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Stiff-Leg Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Good Morning',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.65 }
		]
	},
	{
		name: 'Lying Leg Curl',
		equipment: ['Leg Curl Machine (Lying)'],
		muscles: [{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Seated Leg Curl',
		equipment: ['Leg Curl Machine (Seated)'],
		muscles: [{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Nordic Curl',
		equipment: ['Bodyweight', 'GHD Machine (Glute Ham Developer)'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Glute-Ham Raise',
		equipment: ['GHD Machine (Glute Ham Developer)'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Single-Leg Romanian Deadlift',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Slider Leg Curl',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== GLUTES ====================
	{
		name: 'Hip Thrust',
		equipment: ['Barbell', 'Hip Thrust Bench'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.45 }
		]
	},
	{
		name: 'Dumbbell Hip Thrust',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Glute Bridge',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Single-Leg Glute Bridge',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Cable Pull-Through',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.35 }
		]
	},
	{
		name: 'Cable Glute Kickback',
		equipment: ['Cable Machine', 'Ankle Strap'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Machine Glute Kickback',
		equipment: ['Glute Kickback Machine'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Frog Pump',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 0.9 }]
	},
	{
		name: 'Sumo Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Adductors', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Conventional Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 0.75 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Trap Bar Deadlift',
		equipment: ['Trap Bar (Hex Bar)'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Hip Abduction (Machine)',
		equipment: ['Hip Abductor Machine'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 0.85 }]
	},
	{
		name: 'Banded Clamshell',
		equipment: ['Resistance Bands'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 0.85 }]
	},

	// ==================== CALVES ====================
	{
		name: 'Standing Calf Raise (Machine)',
		equipment: ['Calf Raise Machine (Standing)'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Seated Calf Raise',
		equipment: ['Calf Raise Machine (Seated)'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Donkey Calf Raise',
		equipment: ['Calf Raise Machine (Donkey)'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Leg Press Calf Raise',
		equipment: ['Leg Press Machine'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 0.95 }]
	},
	{
		name: 'Smith Machine Calf Raise',
		equipment: ['Smith Machine'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 0.95 }]
	},
	{
		name: 'Single-Leg Calf Raise',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 0.9 }]
	},

	// ==================== ADDUCTORS ====================
	{
		name: 'Hip Adduction (Machine)',
		equipment: ['Hip Adductor Machine'],
		muscles: [{ muscle: 'Adductors', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Copenhagen Adductor',
		equipment: ['Flat Bench'],
		muscles: [{ muscle: 'Adductors', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Cable Adduction',
		equipment: ['Cable Machine', 'Ankle Strap'],
		muscles: [{ muscle: 'Adductors', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Sumo Squat',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Adductors', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		]
	},

	// ==================== ABS ====================
	{
		name: 'Hanging Leg Raise',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Hanging Knee Raise',
		equipment: ['Pull-up Bar'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.9 }]
	},
	{
		name: 'Cable Crunch',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Machine Crunch',
		equipment: ['Ab Crunch Machine'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.95 }]
	},
	{
		name: 'Ab Wheel Rollout',
		equipment: ['Ab Wheel'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'Plank',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Dead Bug',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.85 }]
	},
	{
		name: 'Hollow Body Hold',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.9 }]
	},
	{
		name: 'Reverse Crunch',
		equipment: ['Flat Bench'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.95 }]
	},
	{
		name: 'Lying Leg Raise',
		equipment: ['Flat Bench'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.3 }
		]
	},
	{
		name: 'V-Up',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.9 }]
	},
	{
		name: 'Toes-to-Bar',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.5 }
		]
	},

	// ==================== OBLIQUES ====================
	{
		name: 'Side Plank',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Pallof Press',
		equipment: ['Cable Machine', 'D-Handle Attachment'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.6 }
		]
	},
	{
		name: 'Russian Twist',
		equipment: ['Medicine Ball'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Cable Woodchop',
		equipment: ['Cable Machine', 'D-Handle Attachment'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.45 }
		]
	},
	{
		name: 'Rotary Torso Machine',
		equipment: ['Rotary Torso Machine'],
		muscles: [{ muscle: 'Obliques', activation: 'primary', weighting: 0.9 }]
	},
	{
		name: 'Bicycle Crunch',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.7 }
		]
	},
	{
		name: 'Landmine Rotation',
		equipment: ['Barbell', 'Landmine Attachment'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Side Bend (Dumbbell)',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Obliques', activation: 'primary', weighting: 0.85 }]
	},

	// ==================== LOWER BACK ====================
	{
		name: 'Back Extension',
		equipment: ['Roman Chair'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Weighted Back Extension',
		equipment: ['Roman Chair', 'Weight Plates'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.45 }
		]
	},
	{
		name: 'Machine Back Extension',
		equipment: ['Back Extension Machine'],
		muscles: [{ muscle: 'Lower Back', activation: 'primary', weighting: 0.95 }]
	},
	{
		name: 'Reverse Hyperextension',
		equipment: ['Reverse Hyper Machine'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.5 }
		]
	},
	{
		name: 'Superman',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		]
	},
	{
		name: 'Bird Dog',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		]
	},

	// ==================== NECK ====================
	{
		name: 'Neck Curl',
		equipment: ['Neck Harness', 'Weight Plates'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Neck Extension',
		equipment: ['Neck Harness', 'Weight Plates'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 1.0 }]
	},
	{
		name: 'Plate-Loaded Neck Flexion',
		equipment: ['Weight Plates', 'Flat Bench'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 0.9 }]
	},
	{
		name: 'Plate-Loaded Neck Extension',
		equipment: ['Weight Plates', 'Flat Bench'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 0.9 }]
	},
	{
		name: 'Neck Lateral Flexion',
		equipment: ['Neck Harness', 'Weight Plates'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 0.9 }]
	}
] as const;
