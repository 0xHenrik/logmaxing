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
		mavMin: 12,
		mavMax: 20,
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
		frequencyMin: 1,
		frequencyMax: 2,
		trainingTips: 'Gets significant volume from pressing. Direct work often unnecessary.'
	},
	{
		name: 'Side Delts',
		muscleGroup: 'Push',
		mv: 0,
		mev: 8,
		mavMin: 16,
		mavMax: 22,
		mrv: 26,
		recoveryDays: 1,
		frequencyMin: 2,
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
		mv: 5,
		mev: 8,
		mavMin: 14,
		mavMax: 20,
		mrv: 26,
		recoveryDays: 2,
		frequencyMin: 2,
		frequencyMax: 6,
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
		mrv: 20,
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
		frequencyMin: 2,
		frequencyMax: 4,
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
		mavMin: 16,
		mavMax: 20,
		mrv: 25,
		recoveryDays: 1,
		frequencyMin: 3,
		frequencyMax: 5,
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Lie on bench with eyes under the bar',
			'Grip bar with hands shoulder-width apart or slightly narrower',
			'Unrack and position bar over chest',
			'Lower bar to lower chest with elbows tucked close to body',
			'Press bar up by extending elbows'
		],
		tips: [
			'Keep elbows at 30-45 degrees from torso',
			'Focus on pushing through the triceps',
			'Touch lower on chest than regular bench press',
			'Avoid flaring elbows to protect shoulders'
		]
	},
	{
		name: 'Wide-Grip Bench Press',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Lie on bench with eyes under the bar',
			'Grip bar 1.5-2x shoulder width',
			'Unrack and position bar over chest',
			'Lower bar to mid-chest with elbows at 75-90 degrees',
			'Press bar up while focusing on chest squeeze'
		],
		tips: [
			'Greater stretch on pecs but more shoulder stress',
			'Avoid going too wide to protect shoulders',
			'Focus on feeling chest stretch at bottom',
			'May need lighter weight than standard grip'
		]
	},
	{
		name: 'Incline Barbell Press',
		equipment: ['Barbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion', 'shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set bench to 30-45 degree incline',
			'Lie back and grip bar slightly wider than shoulder width',
			'Unrack and position bar over upper chest',
			'Lower bar to upper chest/clavicle area',
			'Press bar up and slightly back to starting position'
		],
		tips: [
			'30 degrees emphasizes chest, 45+ shifts to shoulders',
			'Keep shoulder blades retracted throughout',
			'Bar path should be slightly diagonal',
			'Targets upper pec fibers (clavicular head)'
		]
	},
	{
		name: 'Decline Barbell Press',
		equipment: ['Barbell', 'Decline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 }
		],
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
			'Secure legs under pads on decline bench',
			'Grip bar slightly wider than shoulder width',
			'Unrack and lower bar to lower chest',
			'Press bar up to starting position',
			'Keep core tight throughout movement'
		],
		tips: [
			'Targets lower pec fibers (sternal head)',
			'Reduced shoulder stress compared to flat bench',
			'Usually allows heavier weight than flat bench',
			'Use a spotter or safety pins'
		]
	},
	{
		name: 'Dumbbell Bench Press',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Sit on bench with dumbbells on thighs',
			'Kick dumbbells up while lying back',
			'Position dumbbells at chest level, palms facing forward',
			'Press dumbbells up and together',
			'Lower under control to deep stretch'
		],
		tips: [
			'Greater ROM than barbell - more pec stretch',
			'Can rotate palms for comfort',
			'Each arm works independently for balance',
			'Squeeze dumbbells together at top'
		]
	},
	{
		name: 'Incline Dumbbell Press',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion', 'shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set bench to 30-45 degree incline',
			'Kick dumbbells up while lying back',
			'Start with dumbbells at upper chest level',
			'Press up and together over upper chest',
			'Lower with control to deep stretch'
		],
		tips: [
			'Excellent for upper chest development',
			'Greater ROM than barbell incline',
			'Keep shoulder blades pinched back',
			'Can use neutral grip for shoulder comfort'
		]
	},
	{
		name: 'Decline Dumbbell Press',
		equipment: ['Dumbbell', 'Decline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Secure legs under pads on decline bench',
			'Get dumbbells into position at chest level',
			'Press dumbbells up and together',
			'Lower under control to deep stretch',
			'Keep core engaged throughout'
		],
		tips: [
			'Targets lower chest fibers',
			'Greater ROM than barbell decline',
			'Be careful getting into position',
			'Have spotter assist with heavy weight'
		]
	},
	{
		name: 'Dumbbell Flye',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Lie on bench holding dumbbells above chest',
			'Maintain slight bend in elbows throughout',
			'Lower dumbbells in arc to sides until stretch felt',
			'Squeeze chest to bring dumbbells back together',
			'Keep elbows at consistent angle'
		],
		tips: [
			'Hardest at bottom stretch - great for hypertrophy',
			'Avoid going too deep to protect shoulders',
			'Focus on chest stretch and squeeze',
			'Use lighter weight than presses'
		]
	},
	{
		name: 'Incline Dumbbell Flye',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set bench to 30-45 degree incline',
			'Hold dumbbells above upper chest with slight elbow bend',
			'Lower in arc to sides until stretch felt',
			'Squeeze upper chest to bring dumbbells together',
			'Maintain elbow angle throughout'
		],
		tips: [
			'Targets upper chest with lengthened bias',
			'Excellent for stretch-mediated hypertrophy',
			'Control the negative for maximum tension',
			'Pair with incline press for complete upper chest'
		]
	},
	{
		name: 'Cable Crossover (High to Low)',
		equipment: ['Dual Cable Crossover'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction', 'shoulder_adduction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set pulleys to highest position',
			'Grab handles and step forward into staggered stance',
			'Start with arms extended to sides at chest height',
			'Bring hands together in front of lower chest',
			'Squeeze chest at bottom, return with control'
		],
		tips: [
			'Targets lower chest fibers',
			'Constant tension throughout ROM',
			'Focus on squeezing chest at bottom',
			'Maintain slight elbow bend'
		]
	},
	{
		name: 'Cable Crossover (Low to High)',
		equipment: ['Dual Cable Crossover'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction', 'shoulder_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set pulleys to lowest position',
			'Grab handles and step forward into staggered stance',
			'Start with arms down and slightly behind',
			'Bring hands up and together in front of upper chest',
			'Squeeze upper chest at top, return with control'
		],
		tips: [
			'Targets upper chest fibers',
			'Great for clavicular head activation',
			'Think of hugging a tree upward',
			'Constant tension from cables'
		]
	},
	{
		name: 'Cable Flye (Mid)',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.25 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set pulleys to chest height',
			'Grab handles and step forward',
			'Start with arms extended to sides',
			'Bring hands together in front of chest',
			'Squeeze and return with control'
		],
		tips: [
			'Targets middle chest fibers',
			'Excellent constant tension throughout',
			'Good for pump and metabolic stress',
			'Maintain slight elbow bend'
		]
	},
	{
		name: 'Pec Deck Flye',
		equipment: ['Pec Deck Machine'],
		muscles: [{ muscle: 'Chest', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Adjust seat so handles align with chest',
			'Grip handles or place forearms on pads',
			'Start with arms extended to sides',
			'Bring arms together in front of chest',
			'Squeeze chest and return with control'
		],
		tips: [
			'Machine provides stable isolated chest work',
			'Focus on stretch at start position',
			'Squeeze hard at contracted position',
			'Great for beginners and high-rep work'
		]
	},
	{
		name: 'Machine Chest Press',
		equipment: ['Chest Press Machine'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Adjust seat height so handles align with mid-chest',
			'Grip handles and press forward',
			'Extend arms fully without locking elbows',
			'Return with control to stretched position',
			'Keep back against pad throughout'
		],
		tips: [
			'Great for beginners and muscle isolation',
			'Fixed path reduces stabilizer involvement',
			'Safe for training to failure',
			'Focus on mind-muscle connection'
		]
	},
	{
		name: 'Incline Machine Press',
		equipment: ['Incline Chest Press Machine'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion', 'shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Adjust seat so handles align with upper chest',
			'Grip handles and press forward and up',
			'Extend arms fully without locking',
			'Return with control',
			'Keep shoulders back against pad'
		],
		tips: [
			'Targets upper chest safely',
			'Good for beginners learning movement',
			'Allows focus on upper chest activation',
			'Can go heavy with good safety'
		]
	},
	{
		name: 'Push-Up',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Start in plank position with hands shoulder-width apart',
			'Keep body in straight line from head to heels',
			'Lower chest to floor with elbows at 45 degrees',
			'Press back up to starting position',
			'Maintain core tension throughout'
		],
		tips: [
			'Foundation of bodyweight pressing',
			'Scale by elevating hands or doing from knees',
			'Progress to weighted vest for overload',
			'Full ROM - chest to floor'
		]
	},
	{
		name: 'Weighted Dip (Chest)',
		equipment: ['Dip Station', 'Dip Belt'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.7 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'shoulder_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Attach weight to dip belt',
			'Grip bars and support body with arms extended',
			'Lean forward 30-45 degrees for chest emphasis',
			'Lower until shoulders are below elbows',
			'Press back up to starting position'
		],
		tips: [
			'Forward lean targets chest over triceps',
			'Excellent for lower chest development',
			'Deep stretch at bottom - great for hypertrophy',
			'Progress weight gradually to protect shoulders'
		]
	},
	{
		name: 'Landmine Press',
		equipment: ['Barbell', 'Landmine Attachment'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Stand facing the landmine with bar at shoulder height',
			'Grip end of bar with one or both hands',
			'Press bar up and away at 45 degree angle',
			'Lower with control to starting position',
			'Keep core braced throughout'
		],
		tips: [
			'Arcing path is shoulder-friendly',
			'Good for those with shoulder issues',
			'Can do standing, kneeling, or half-kneeling',
			'Unilateral version great for imbalances'
		]
	},
	{
		name: 'Smith Machine Bench Press',
		equipment: ['Smith Machine', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Position bench so bar touches mid-chest at bottom',
			'Grip bar slightly wider than shoulder width',
			'Unrack and lower to chest',
			'Press up in fixed vertical path',
			'Lock out without fully extending elbows'
		],
		tips: [
			'Fixed path reduces stabilizer demands',
			'Safe for training to failure without spotter',
			'Good for learning movement pattern',
			'Position bench carefully for proper bar path'
		]
	},

	// ==================== SHOULDERS ====================
	{
		name: 'Overhead Press',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion', 'shoulder_abduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Stand with feet shoulder-width apart',
			'Grip bar slightly wider than shoulder width at collarbone',
			'Brace core and squeeze glutes',
			'Press bar straight up, moving head back to clear chin',
			'Lock out overhead with bar over mid-foot'
		],
		tips: [
			'Keep body tight - no excessive back lean',
			'Full lockout overhead for complete ROM',
			'Breathe and brace between reps',
			'Foundation movement for shoulder strength'
		]
	},
	{
		name: 'Seated Dumbbell Shoulder Press',
		equipment: ['Dumbbell', 'Adjustable Bench'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion', 'shoulder_abduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set bench to 90 degrees or slight incline (75-85)',
			'Kick dumbbells up to shoulder level',
			'Start with dumbbells at ear level, palms forward',
			'Press dumbbells up and together overhead',
			'Lower with control to starting position'
		],
		tips: [
			'Independent arms allow natural movement path',
			'Greater ROM than barbell version',
			'Slight incline reduces lower back stress',
			'Can use neutral grip for shoulder comfort'
		]
	},
	{
		name: 'Arnold Press',
		equipment: ['Dumbbell', 'Adjustable Bench'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'multi' as const,
		jointActions: [
			'shoulder_flexion',
			'shoulder_abduction',
			'shoulder_external_rotation',
			'elbow_extension'
		],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Start with dumbbells at chest level, palms facing you',
			'As you press up, rotate palms to face forward',
			'Continue pressing to full lockout',
			'Reverse the motion on the way down',
			'Finish with palms facing you at chest level'
		],
		tips: [
			'Rotation increases time under tension',
			'Hits front and side delts through rotation',
			'Use lighter weight than standard press',
			'Control the rotation - no rushing'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'sagittal' as const,
		jointActions: [
			'shoulder_flexion',
			'shoulder_abduction',
			'elbow_extension',
			'hip_extension',
			'knee_extension'
		],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Start with bar at collarbone in front rack position',
			'Dip by bending knees slightly (2-4 inches)',
			'Explosively extend legs and hips',
			'Use momentum to drive bar overhead',
			'Lock out arms and lower with control'
		],
		tips: [
			'Allows heavier loads than strict press',
			'Dip should be quick - not a squat',
			'Good for overloading delts and building power',
			'Keep torso vertical during dip'
		]
	},
	{
		name: 'Machine Shoulder Press',
		equipment: ['Shoulder Press Machine'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion', 'shoulder_abduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Adjust seat so handles are at shoulder height',
			'Grip handles and press overhead',
			'Extend arms fully without locking elbows hard',
			'Lower with control to starting position',
			'Keep back against pad throughout'
		],
		tips: [
			'Great for beginners and isolation',
			'Fixed path allows focus on delts',
			'Safe for training to failure',
			'Good for high-rep pump work'
		]
	},
	{
		name: 'Dumbbell Lateral Raise',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['shoulder_abduction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand with dumbbells at sides, slight elbow bend',
			'Raise arms out to sides until parallel to floor',
			'Lead with elbows, not hands',
			'Brief pause at top',
			'Lower with control to starting position'
		],
		tips: [
			'Classic bell-shaped curve - hardest at top',
			'Avoid using momentum or swinging',
			'Slight forward lean can improve tension',
			'Keep thumbs neutral or slightly down'
		]
	},
	{
		name: 'Cable Lateral Raise',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.25 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['shoulder_abduction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable to lowest position',
			'Stand sideways to machine, grab handle with far hand',
			'Raise arm out to side until parallel to floor',
			'Control the negative back to start',
			'Complete all reps then switch sides'
		],
		tips: [
			'Constant tension throughout ROM',
			'Better resistance curve than dumbbells',
			'Can do behind or in front of body',
			'Great for stretch-mediated hypertrophy'
		]
	},
	{
		name: 'Machine Lateral Raise',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Side Delts', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['shoulder_abduction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Adjust seat so pads align with outer arms',
			'Place outer arms against pads',
			'Raise arms out to sides by pressing against pads',
			'Pause briefly at top',
			'Lower with control'
		],
		tips: [
			'Isolates side delts with minimal cheating',
			'Good for high-rep burnout sets',
			'Focus on pushing through elbows',
			'Great for beginners'
		]
	},
	{
		name: 'Upright Row',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'frontal' as const,
		jointActions: ['shoulder_abduction', 'shoulder_internal_rotation', 'elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Stand holding barbell with overhand grip',
			'Grip can be narrow to shoulder width',
			'Pull bar up along body leading with elbows',
			'Raise until elbows are at or above shoulder height',
			'Lower with control'
		],
		tips: [
			'Wider grip is more shoulder-friendly',
			'Lead with elbows to target delts',
			'Avoid pulling too high if shoulder discomfort',
			'Can aggravate shoulder impingement in some'
		]
	},
	{
		name: 'Dumbbell Upright Row',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'frontal' as const,
		jointActions: ['shoulder_abduction', 'elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand with dumbbells in front of thighs',
			'Pull dumbbells up along body leading with elbows',
			'Raise until elbows are at shoulder height',
			'Allow natural arm path - not fixed like barbell',
			'Lower with control'
		],
		tips: [
			'More shoulder-friendly than barbell version',
			'Natural path reduces impingement risk',
			'Focus on lifting elbows, not hands',
			'Good alternative if barbell causes discomfort'
		]
	},
	{
		name: 'Face Pull',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_abduction', 'shoulder_external_rotation', 'elbow_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable at face height or slightly above',
			'Grip rope with thumbs pointing back',
			'Pull rope toward face, separating hands',
			'Externally rotate shoulders as you pull',
			'Finish with hands beside ears, elbows high'
		],
		tips: [
			'Excellent for shoulder health and posture',
			'Focus on external rotation at end',
			'Keep elbows high throughout',
			'Great warm-up or finisher exercise'
		]
	},
	{
		name: 'Reverse Pec Deck',
		equipment: ['Rear Delt Machine'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_abduction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Face the pec deck machine (reverse position)',
			'Adjust seat so handles align with shoulders',
			'Grip handles with arms extended forward',
			'Pull handles back in arc, squeezing rear delts',
			'Return with control to starting position'
		],
		tips: [
			'Isolated rear delt work on machine',
			'Great for beginners and high reps',
			'Focus on squeezing rear delts',
			'Avoid using momentum'
		]
	},
	{
		name: 'Bent-Over Dumbbell Reverse Flye',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_abduction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Hinge forward at hips until torso is near parallel to floor',
			'Let dumbbells hang below with slight elbow bend',
			'Raise arms out to sides in arc motion',
			'Squeeze rear delts at top',
			'Lower with control'
		],
		tips: [
			'Keep torso stable - no swinging',
			'Lead with elbows, not hands',
			'Use lighter weight for better isolation',
			'Can do seated on bench for more stability'
		]
	},
	{
		name: 'Cable Reverse Flye',
		equipment: ['Dual Cable Crossover'],
		muscles: [
			{ muscle: 'Rear Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_abduction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set cables at shoulder height',
			'Cross arms and grab opposite handles',
			'Step back and extend arms forward',
			'Pull hands apart in arc, squeezing rear delts',
			'Return with control, crossing arms again'
		],
		tips: [
			'Constant tension from cables',
			'Great for rear delt development',
			'Can do high or low cable positions',
			'Focus on squeezing shoulder blades'
		]
	},
	{
		name: 'Dumbbell Front Raise',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand with dumbbells at front of thighs',
			'Keep slight bend in elbows',
			'Raise one or both arms forward to shoulder height',
			'Pause briefly at top',
			'Lower with control'
		],
		tips: [
			'Often unnecessary if doing pressing',
			'Front delts get lots of indirect work',
			'Keep body stable - no swinging',
			'Can alternate arms or do simultaneously'
		]
	},
	{
		name: 'Cable Front Raise',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Front Delts', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable to lowest position',
			'Face away from machine, grab handle',
			'Raise arm forward to shoulder height',
			'Control the negative back down',
			'Complete reps then switch arms'
		],
		tips: [
			'Constant tension throughout ROM',
			'Better resistance curve than dumbbells',
			'Keep torso stable',
			'Good for front delt isolation if needed'
		]
	},
	{
		name: 'Plate Front Raise',
		equipment: ['Weight Plates'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Hold plate with both hands at sides of plate',
			'Start with plate at thigh level',
			'Raise plate forward to shoulder height or above',
			'Pause at top',
			'Lower with control'
		],
		tips: [
			'Grip width affects muscle emphasis',
			'Can raise to overhead for more ROM',
			'Keep arms relatively straight',
			'Minimal equipment option for front delts'
		]
	},
	{
		name: 'Lu Raise',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'multi' as const,
		jointActions: ['shoulder_abduction', 'shoulder_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Start with dumbbells at sides',
			'Raise arms forward 45 degrees from lateral',
			'Continue raising to overhead',
			'Lower in reverse arc to starting position',
			'Maintain slight elbow bend throughout'
		],
		tips: [
			'Named after Olympic lifter Lu Xiaojun',
			'Combines front and lateral raise paths',
			'Great for overall shoulder development',
			'Use lighter weight than standard lateral raise'
		]
	},

	// ==================== TRICEPS ====================
	{
		name: 'Tricep Pushdown',
		equipment: ['Cable Machine', 'Straight Bar Attachment'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set cable at highest position with straight bar',
			'Grip bar with hands shoulder-width apart',
			'Keep elbows pinned to sides',
			'Press bar down until arms fully extended',
			'Control the return to starting position'
		],
		tips: [
			'Emphasizes lateral and medial heads',
			'Keep upper arms stationary',
			'Squeeze triceps hard at bottom',
			'Avoid letting elbows drift forward'
		]
	},
	{
		name: 'Rope Tricep Pushdown',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable at highest position with rope attachment',
			'Grip rope ends with neutral grip',
			'Keep elbows pinned to sides',
			'Press down and split rope apart at bottom',
			'Squeeze triceps at full extension'
		],
		tips: [
			'Splitting rope at bottom increases lateral head activation',
			'Natural wrist position reduces strain',
			'Great for high-rep pump work',
			'Control the negative'
		]
	},
	{
		name: 'Overhead Tricep Extension (Cable)',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable at lowest position',
			'Face away from machine, grip rope overhead',
			'Stagger stance for stability, lean slightly forward',
			'Extend elbows to push rope forward and up',
			'Lower with control, feeling long head stretch'
		],
		tips: [
			'Best exercise for long head (largest portion)',
			'Overhead position stretches long head fully',
			'Hardest at bottom stretch - great for hypertrophy',
			'Keep upper arms stationary beside head'
		]
	},
	{
		name: 'Dumbbell Overhead Tricep Extension',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Hold one dumbbell overhead with both hands',
			'Grip the inner plate or handle with palms facing up',
			'Keep elbows close to head pointing up',
			'Lower dumbbell behind head by bending elbows',
			'Extend elbows to return to start'
		],
		tips: [
			'Excellent long head stretch',
			'Can do one arm at a time for unilateral work',
			'Keep core braced to protect lower back',
			'Go deep for full long head stretch'
		]
	},
	{
		name: 'Skull Crushers',
		equipment: ['EZ Curl Bar', 'Flat Bench'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Lie on bench holding EZ bar above chest',
			'Keep upper arms perpendicular to floor',
			'Lower bar toward forehead by bending elbows',
			'Stop just above forehead or slightly behind',
			'Extend elbows to return to start'
		],
		tips: [
			'Lowering behind head increases long head stretch',
			'EZ bar reduces wrist strain vs straight bar',
			'Keep elbows from flaring out',
			'Control the weight - skull crushers named for a reason'
		]
	},
	{
		name: 'Dumbbell Skull Crushers',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Lie on bench holding dumbbells above chest',
			'Use neutral grip with palms facing each other',
			'Lower dumbbells toward temples by bending elbows',
			'Keep upper arms stationary',
			'Extend elbows to return to start'
		],
		tips: [
			'Independent arms work stabilizers more',
			'Neutral grip is often more comfortable',
			'Can lower beside head rather than to forehead',
			'Good alternative if EZ bar causes elbow pain'
		]
	},
	{
		name: 'Tricep Dip',
		equipment: ['Dip Station'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension', 'shoulder_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Grip parallel bars and support body weight',
			'Keep torso upright (not leaning forward)',
			'Lower body by bending elbows until 90 degrees',
			'Keep elbows close to body',
			'Press back up to full arm extension'
		],
		tips: [
			'Upright torso emphasizes triceps over chest',
			'Elbows back, not flared out',
			'Add weight with belt when bodyweight is easy',
			'Stop at 90 degrees to protect shoulders'
		]
	},
	{
		name: 'Bench Dip',
		equipment: ['Flat Bench'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension', 'shoulder_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Place hands on bench behind you, fingers forward',
			'Extend legs out front (bent knees = easier)',
			'Lower body by bending elbows to 90 degrees',
			'Keep back close to bench',
			'Press back up to starting position'
		],
		tips: [
			'Good beginner tricep exercise',
			'Extend legs for more difficulty',
			'Add weight plate on lap to progress',
			'Avoid going too deep to protect shoulders'
		]
	},
	{
		name: 'Diamond Push-Up',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension', 'shoulder_horizontal_adduction'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Place hands together forming diamond with thumbs and index fingers',
			'Assume push-up position with hands under chest',
			'Keep body in straight line',
			'Lower chest toward hands',
			'Press back up, focusing on tricep contraction'
		],
		tips: [
			'Highest tricep EMG of push-up variations',
			'Keep elbows close to body',
			'Hands directly under chest, not under face',
			'Scale by doing from knees if needed'
		]
	},
	{
		name: 'Tricep Kickback',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 0.95 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Hinge forward with one hand on bench for support',
			'Hold dumbbell with upper arm parallel to floor',
			'Keep elbow pinned at side',
			'Extend elbow to straighten arm back',
			'Squeeze tricep at full extension, then lower'
		],
		tips: [
			'Peak contraction at lockout',
			'Keep upper arm completely still',
			'Use lighter weight for strict form',
			'Good for feeling the squeeze at shortened position'
		]
	},
	{
		name: 'Tricep Cable Kickback',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 0.95 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable at low position',
			'Hinge forward facing the cable machine',
			'Keep upper arm parallel to floor',
			'Extend elbow against cable resistance',
			'Squeeze at full extension, return with control'
		],
		tips: [
			'Cable provides constant tension unlike dumbbell',
			'Better resistance curve than dumbbell version',
			'Can use D-handle or no attachment',
			'Good for high-rep finisher'
		]
	},
	{
		name: 'Machine Tricep Extension',
		equipment: ['Tricep Extension Machine'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Adjust seat and arm pads for proper alignment',
			'Place back of upper arms on pad',
			'Grip handles and press down to extend elbows',
			'Full extension at bottom',
			'Control the return to stretched position'
		],
		tips: [
			'Isolated tricep work with machine support',
			'Great for beginners and high volume',
			'Consistent resistance curve',
			'Good for training to failure safely'
		]
	},
	{
		name: 'JM Press',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension', 'shoulder_horizontal_adduction'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Lie on bench as for close-grip bench press',
			'Lower bar toward neck/upper chest area',
			'Allow elbows to drift forward as you lower',
			'Bar path is a blend of skull crusher and press',
			'Press back up extending elbows'
		],
		tips: [
			'Hybrid between skull crusher and close-grip bench',
			'Named after powerlifter JM Blakley',
			'Allows heavier loads than skull crushers',
			'Advanced exercise - master basics first'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_adduction', 'shoulder_extension', 'elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Grip bar slightly wider than shoulder width, palms forward',
			'Hang with arms fully extended (dead hang)',
			'Pull body up by driving elbows down',
			'Continue until chin clears the bar',
			'Lower with control to full hang'
		],
		tips: [
			'Foundation vertical pulling movement',
			'Full ROM - dead hang to chin over bar',
			'Initiate by depressing and retracting scapulae',
			'Progress to weighted when 10+ reps easy'
		]
	},
	{
		name: 'Chin-Up',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_adduction', 'shoulder_extension', 'elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Grip bar shoulder-width, palms facing you (supinated)',
			'Hang with arms fully extended',
			'Pull body up driving elbows down and back',
			'Continue until chin clears bar',
			'Lower with control to full extension'
		],
		tips: [
			'Underhand grip increases bicep involvement',
			'Generally easier than overhand pull-ups',
			'Great for both lat and bicep development',
			'Full stretch at bottom is key'
		]
	},
	{
		name: 'Weighted Pull-Up',
		equipment: ['Pull-up Bar', 'Dip Belt'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_adduction', 'shoulder_extension', 'elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Attach weight plate to dip belt',
			'Grip bar and hang with full arm extension',
			'Pull body up until chin clears bar',
			'Control the descent - no swinging',
			'Full extension at bottom before next rep'
		],
		tips: [
			'Progress gradually to protect shoulders',
			'Maintain strict form - no kipping',
			'Great for building back strength and size',
			'Use lower weight for higher quality reps'
		]
	},
	{
		name: 'Lat Pulldown',
		equipment: ['Lat Pulldown Machine', 'Lat Pulldown Bar'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_adduction', 'shoulder_extension', 'elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Grip bar slightly wider than shoulder width',
			'Sit with thighs secured under pads',
			'Lean back slightly and pull bar to upper chest',
			'Squeeze lats at bottom',
			'Control the return to full stretch'
		],
		tips: [
			'Machine alternative to pull-ups',
			'Allows precise loading for all levels',
			'Focus on pulling through elbows',
			'Full stretch at top is crucial for growth'
		]
	},
	{
		name: 'Close-Grip Lat Pulldown',
		equipment: ['Lat Pulldown Machine', 'V-Bar Attachment'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_adduction', 'shoulder_extension', 'elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Attach V-bar or close-grip handle',
			'Grip with neutral (palms facing) grip',
			'Sit and secure thighs, lean back slightly',
			'Pull handle to lower chest',
			'Squeeze lats and return with control'
		],
		tips: [
			'Neutral grip is often more comfortable',
			'Increased bicep involvement with close grip',
			'Greater ROM than wide grip',
			'Good for overall lat thickness'
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
		],
		difficulty: 'beginner' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'frontal' as const,
		jointActions: ['shoulder_adduction', 'elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Grip bar at widest comfortable position',
			'Sit with thighs secured',
			'Pull bar to upper chest, elbows out wide',
			'Squeeze shoulder blades together',
			'Control return to full stretch'
		],
		tips: [
			'Emphasizes lat width over thickness',
			'Keep chest up and proud',
			'Pull to upper chest, not behind neck',
			'Feel the stretch at top'
		]
	},
	{
		name: 'Straight-Arm Pulldown',
		equipment: ['Cable Machine', 'Straight Bar Attachment'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set cable at highest position',
			'Stand back and grip bar with arms extended',
			'Hinge slightly at hips',
			'Pull bar down to thighs keeping arms straight',
			'Squeeze lats at bottom, control return'
		],
		tips: [
			'Isolates lats by removing bicep involvement',
			'Great for mind-muscle connection',
			'Good warm-up or pre-exhaust exercise',
			'Keep slight bend in elbows but arms mostly straight'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Hinge at hips with bar hanging at arm length',
			'Keep back flat, torso at 45-degree angle',
			'Pull bar to lower chest/upper abdomen',
			'Squeeze shoulder blades together at top',
			'Lower with control to full arm extension'
		],
		tips: [
			'Foundation horizontal pulling movement',
			'Overhand grip emphasizes upper back',
			'Underhand grip shifts emphasis to lats',
			'Keep core tight to protect lower back'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set up like deadlift with torso parallel to floor',
			'Bar starts on floor each rep',
			'Explosively row bar to lower chest',
			'Lower bar to floor (dead stop)',
			'Reset position before each rep'
		],
		tips: [
			'Each rep from dead stop eliminates momentum',
			'More upper back emphasis than bent-over row',
			'Builds explosive pulling power',
			'Named after coach Glenn Pendlay'
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
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Place one hand and knee on bench for support',
			'Let dumbbell hang at arm length',
			'Row dumbbell to hip by driving elbow up and back',
			'Squeeze lat at top',
			'Lower with control and repeat'
		],
		tips: [
			'Unilateral work fixes imbalances',
			'Allow full stretch at bottom',
			'Row to hip, not to chest, for lat emphasis',
			'Keep back flat throughout'
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
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set incline bench at 30-45 degrees',
			'Lie face down with chest on pad',
			'Let dumbbells hang at arm length',
			'Row both dumbbells up squeezing back',
			'Lower with control to full stretch'
		],
		tips: [
			'Eliminates lower back fatigue/cheating',
			'Pure upper back isolation',
			'Great for those with lower back issues',
			'Can focus entirely on back contraction'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand over T-bar with feet shoulder-width',
			'Grip handle with both hands',
			'Hinge at hips maintaining flat back',
			'Row bar to chest',
			'Lower with control'
		],
		tips: [
			'Neutral grip is shoulder-friendly',
			'Allows heavy loading for back thickness',
			'Keep chest on pad if machine has one',
			'Classic bodybuilding back exercise'
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
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Sit with feet on platform, knees slightly bent',
			'Grip V-bar handle and sit upright',
			'Pull handle to abdomen',
			'Squeeze shoulder blades together',
			'Extend arms forward for full stretch'
		],
		tips: [
			'Constant tension from cable',
			'Allow forward stretch but keep back flat',
			'Pull to lower chest/upper abs',
			'Great for back thickness'
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
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_abduction', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Attach wide bar to cable row',
			'Grip wider than shoulder width',
			'Sit upright with feet on platform',
			'Pull bar to upper abdomen with elbows flared',
			'Squeeze upper back, return with control'
		],
		tips: [
			'Wide grip + high elbows = upper back focus',
			'Less lat involvement than close grip',
			'Great for rear delt and rhomboid development',
			'Think about squeezing elbows behind you'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'overhand' as const,
		instructions: [
			'Stand perpendicular to landmine bar',
			'Stagger stance with inside leg back',
			'Grip end of bar with overhand grip',
			'Row bar toward hip',
			'Lower with control allowing full stretch'
		],
		tips: [
			'Named after bodybuilder John Meadows',
			'Unique angle targets lats differently',
			'Overhand grip for maximum lat stretch',
			'Great for lat width development'
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
		],
		difficulty: 'advanced' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Use heavy dumbbell with straps optional',
			'Support on bench with one arm',
			'Row explosively with some body english allowed',
			'High rep sets (15-25 reps)',
			'Focus on pulling through the full ROM'
		],
		tips: [
			'Named after powerlifter Matt Kroc',
			'Heavy weight, high reps with controlled form',
			'Some momentum is acceptable',
			'Builds back size and grip strength'
		]
	},
	{
		name: 'Machine Row',
		equipment: ['Low Row Machine'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Adjust chest pad and seat height',
			'Grip handles with preferred grip',
			'Pull handles toward torso',
			'Squeeze back at contracted position',
			'Return with control to full stretch'
		],
		tips: [
			'Machine eliminates balance requirements',
			'Focus purely on back contraction',
			'Good for beginners and high volume',
			'Various grip options target different areas'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set up bench elevated on blocks or rack',
			'Lie face down so arms can hang fully extended',
			'Grip barbell hanging below',
			'Row bar to bench/chest',
			'Lower with control to full extension'
		],
		tips: [
			'Completely eliminates lower back stress',
			'Pure horizontal pulling movement',
			'Great for strict back isolation',
			'Requires elevated bench setup'
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
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set bar at waist to chest height in rack',
			'Hang underneath with body straight',
			'Grip bar wider than shoulder width',
			'Pull chest to bar',
			'Lower with control to full extension'
		],
		tips: [
			'Bodyweight horizontal pull progression',
			'Lower bar = harder, higher = easier',
			'Keep body rigid like a reverse plank',
			'Great for building to pull-ups'
		]
	},

	// ==================== TRAPS ====================
	{
		name: 'Barbell Shrug',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Traps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['scapular_elevation'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Stand holding barbell at arm length',
			'Keep arms straight throughout',
			'Shrug shoulders straight up toward ears',
			'Pause and squeeze at top',
			'Lower with control to starting position'
		],
		tips: [
			'No need to roll shoulders - straight up and down',
			'Pause at top for peak contraction',
			'Use straps if grip limits weight',
			'Keep neck neutral - dont push head forward'
		]
	},
	{
		name: 'Dumbbell Shrug',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Traps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['scapular_elevation'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand with dumbbells at sides',
			'Keep arms straight',
			'Shrug shoulders up toward ears',
			'Squeeze traps at top',
			'Lower with control'
		],
		tips: [
			'Dumbbells at sides allow slightly more ROM',
			'Neutral grip more comfortable for many',
			'Can do one arm at a time for focus',
			'Pause at top for best results'
		]
	},
	{
		name: 'Trap Bar Shrug',
		equipment: ['Trap Bar (Hex Bar)'],
		muscles: [
			{ muscle: 'Traps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['scapular_elevation'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand inside trap bar with neutral grip',
			'Stand tall with arms straight',
			'Shrug shoulders up toward ears',
			'Squeeze at top',
			'Lower with control'
		],
		tips: [
			'Neutral grip and center of gravity ideal for heavy shrugs',
			'Bar wont hit thighs like barbell',
			'Can load very heavy safely',
			'Great for trap hypertrophy'
		]
	},
	{
		name: 'Cable Shrug',
		equipment: ['Cable Machine'],
		muscles: [{ muscle: 'Traps', activation: 'primary', weighting: 0.95 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['scapular_elevation'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set cable at lowest position with bar attachment',
			'Stand facing machine, grip bar',
			'Shrug shoulders up',
			'Squeeze at top',
			'Lower with control to stretch'
		],
		tips: [
			'Constant tension throughout ROM',
			'Can also do facing away from machine',
			'Good for high-rep burnout sets',
			'Angle provides unique stimulus'
		]
	},
	{
		name: 'Farmers Walk',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Traps', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.8 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'carry' as const,
		plane: 'sagittal' as const,
		jointActions: ['scapular_elevation', 'grip_isometric'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Pick up heavy dumbbells or farmers handles',
			'Stand tall with shoulders back',
			'Walk with controlled steps',
			'Maintain upright posture throughout',
			'Walk for distance or time'
		],
		tips: [
			'Full body conditioning exercise',
			'Builds trap size from loaded carries',
			'Great for grip strength',
			'Keep shoulders up and back'
		]
	},

	// ==================== BICEPS ====================
	{
		name: 'Barbell Curl',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Stand holding barbell with underhand grip',
			'Keep elbows pinned at sides',
			'Curl bar up toward shoulders',
			'Squeeze biceps at top',
			'Lower with control to full extension'
		],
		tips: [
			'Classic bicep mass builder',
			'Bell curve - hardest when forearms parallel to floor',
			'Avoid swinging - keep strict form',
			'Shoulder-width grip for standard emphasis'
		]
	},
	{
		name: 'EZ Bar Curl',
		equipment: ['EZ Curl Bar'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Stand holding EZ bar at angled grips',
			'Keep elbows pinned at sides',
			'Curl bar up toward shoulders',
			'Squeeze at top',
			'Lower with control'
		],
		tips: [
			'Angled grip reduces wrist strain',
			'Comfortable for those with wrist issues',
			'Slightly reduces bicep activation vs straight bar',
			'Great for high-volume training'
		]
	},
	{
		name: 'Dumbbell Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion', 'forearm_supination'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Stand or sit with dumbbells at sides',
			'Start with palms facing thighs (neutral)',
			'Curl up while supinating (rotating palms up)',
			'Squeeze at top with palms fully supinated',
			'Lower while rotating back to neutral'
		],
		tips: [
			'Supination increases bicep peak contraction',
			'Can do alternating or simultaneous',
			'Independent arms fix imbalances',
			'Natural wrist movement path'
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
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand with dumbbells at sides, palms facing thighs',
			'Keep palms facing each other throughout (neutral grip)',
			'Curl dumbbells up toward shoulders',
			'Squeeze at top',
			'Lower with control'
		],
		tips: [
			'Neutral grip targets brachialis and brachioradialis',
			'Builds arm thickness viewed from front',
			'Good for forearm development',
			'Can alternate arms or do simultaneously'
		]
	},
	{
		name: 'Preacher Curl',
		equipment: ['EZ Curl Bar', 'Preacher Curl Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Sit at preacher bench with armpits at top of pad',
			'Grip EZ bar with underhand grip',
			'Start with arms extended down the pad',
			'Curl bar up, keeping upper arms on pad',
			'Lower with control to full stretch'
		],
		tips: [
			'Eliminates momentum and cheating',
			'Hardest at bottom stretch - great for hypertrophy',
			'Dont come up too high - tension drops at top',
			'Focus on controlled negative'
		]
	},
	{
		name: 'Dumbbell Preacher Curl',
		equipment: ['Dumbbell', 'Preacher Curl Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: true,
		gripType: 'underhand' as const,
		instructions: [
			'Position upper arm on preacher pad',
			'Hold dumbbell with underhand grip',
			'Start with arm fully extended',
			'Curl dumbbell up',
			'Lower with control to full stretch'
		],
		tips: [
			'Unilateral work fixes imbalances',
			'Can use other hand to assist at failure',
			'Great stretch at bottom',
			'Focus on each arm independently'
		]
	},
	{
		name: 'Cable Curl',
		equipment: ['Cable Machine', 'Straight Bar Attachment'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Set cable at lowest position with bar attachment',
			'Stand facing machine and grip bar',
			'Keep elbows at sides',
			'Curl bar up toward shoulders',
			'Lower with control'
		],
		tips: [
			'Constant tension throughout full ROM',
			'No dead spot like free weight curls',
			'Great for pump and high-rep work',
			'Can step back for more stretch at bottom'
		]
	},
	{
		name: 'Rope Hammer Curl',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable at lowest position with rope',
			'Face machine and grip rope ends',
			'Keep neutral grip throughout',
			'Curl up keeping elbows at sides',
			'Lower with control'
		],
		tips: [
			'Constant tension hammer curl variant',
			'Good for brachialis and forearm development',
			'Natural grip position',
			'Can curl to inside or outside of shoulders'
		]
	},
	{
		name: 'Concentration Curl',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: true,
		gripType: 'underhand' as const,
		instructions: [
			'Sit on bench with legs spread',
			'Rest elbow against inner thigh',
			'Let dumbbell hang at full extension',
			'Curl up focusing on bicep contraction',
			'Squeeze at top and lower with control'
		],
		tips: [
			'Highest bicep EMG activation of any curl',
			'Excellent for mind-muscle connection',
			'Complete isolation - no cheating possible',
			'Focus on peak contraction at top'
		]
	},
	{
		name: 'Spider Curl',
		equipment: ['EZ Curl Bar', 'Incline Bench'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Set bench to 45-60 degree incline',
			'Lie face down with arms hanging over top of bench',
			'Grip bar with arms perpendicular to floor',
			'Curl bar up toward face',
			'Squeeze hard at top, lower with control'
		],
		tips: [
			'Hardest at top (shortened position)',
			'Opposite resistance curve to preacher curl',
			'Great for bicep peak development',
			'Pair with preacher curl for full coverage'
		]
	},
	{
		name: 'Machine Bicep Curl',
		equipment: ['Bicep Curl Machine'],
		muscles: [{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Adjust seat and arm pad position',
			'Place back of upper arms on pad',
			'Grip handles',
			'Curl handles toward shoulders',
			'Lower with control to full stretch'
		],
		tips: [
			'Machine provides consistent resistance',
			'Good for beginners and high volume',
			'Safe for training to failure',
			'Focus on squeeze at top'
		]
	},
	{
		name: 'Cross-Body Hammer Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Stand with dumbbell at side, neutral grip',
			'Curl dumbbell across body toward opposite shoulder',
			'Keep elbow stationary at side',
			'Squeeze at top',
			'Lower with control and alternate'
		],
		tips: [
			'Cross-body path targets brachialis more',
			'Adds variety to arm training',
			'Good for arm thickness',
			'Alternate arms for each rep'
		]
	},
	{
		name: 'Zottman Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.7 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion', 'forearm_pronation'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'mixed' as const,
		instructions: [
			'Start with dumbbells at sides, palms forward',
			'Curl up with supinated (underhand) grip',
			'At top, rotate palms to face down (pronated)',
			'Lower with pronated grip',
			'Rotate back to supinated at bottom'
		],
		tips: [
			'Concentric: biceps (supinated), Eccentric: forearms (pronated)',
			'Efficient bicep and forearm training in one',
			'Named after 19th century strongman George Zottman',
			'Use lighter weight than standard curls'
		]
	},

	// ==================== FOREARMS ====================
	{
		name: 'Wrist Curl',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [{ muscle: 'Forearms', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['wrist_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Sit with forearms resting on thighs, wrists over knees',
			'Hold barbell with underhand grip',
			'Let wrists extend down (stretch)',
			'Curl wrists up, squeezing forearm flexors',
			'Lower with control'
		],
		tips: [
			'Targets wrist flexors (inner forearm)',
			'Can let bar roll to fingers for more ROM',
			'Keep forearms stationary',
			'High reps work well for forearms'
		]
	},
	{
		name: 'Reverse Wrist Curl',
		equipment: ['Barbell', 'Flat Bench'],
		muscles: [{ muscle: 'Forearms', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['wrist_extension'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Sit with forearms on thighs, wrists over knees',
			'Hold barbell with overhand grip',
			'Let wrists flex down (stretch)',
			'Extend wrists up against gravity',
			'Lower with control'
		],
		tips: [
			'Targets wrist extensors (outer forearm)',
			'Use lighter weight than wrist curls',
			'Important for balanced forearm development',
			'Helps prevent tennis elbow'
		]
	},
	{
		name: 'Reverse Curl',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Forearms', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Stand holding barbell with overhand grip',
			'Keep elbows at sides',
			'Curl bar up while maintaining overhand grip',
			'Lower with control',
			'Keep wrists neutral throughout'
		],
		tips: [
			'Overhand grip shifts work to brachioradialis',
			'Builds outer forearm and elbow flexors',
			'Use lighter weight than underhand curls',
			'Great for grip and arm thickness'
		]
	},
	{
		name: 'Wrist Roller',
		equipment: ['Wrist Roller'],
		muscles: [{ muscle: 'Forearms', activation: 'primary', weighting: 1.0 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['wrist_flexion', 'wrist_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Hold wrist roller with arms extended',
			'Roll weight up by rotating wrists forward',
			'Continue until fully wound up',
			'Reverse direction to lower weight',
			'Control the descent'
		],
		tips: [
			'Works both flexors and extensors',
			'Can hold arms out front or down',
			'Arms out = harder on shoulders too',
			'Great forearm pump and endurance builder'
		]
	},
	{
		name: 'Dead Hang',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Forearms', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['grip_isometric'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Grip pull-up bar with overhand grip',
			'Hang with arms fully extended',
			'Relax shoulders (passive hang) or engage lats (active)',
			'Hold for time',
			'Step down safely when grip fails'
		],
		tips: [
			'Excellent grip strength builder',
			'Also decompresses spine',
			'Progress by adding time or weight',
			'Can vary grip width and style'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension', 'ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Position bar on upper back/traps',
			'Unrack and step back with feet shoulder-width',
			'Brace core and initiate descent by breaking at hips and knees',
			'Descend until hip crease below knee (parallel or deeper)',
			'Drive through feet to stand, extending hips and knees'
		],
		tips: [
			'King of leg exercises for overall development',
			'Depth matters - at least parallel for full quad activation',
			'Keep knees tracking over toes',
			'Ascend by driving hips forward, not by leaning back'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension', 'ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Position bar on upper traps (high position)',
			'Take narrow grip for shelf',
			'Keep torso more upright than low bar',
			'Descend deep - high bar allows deeper squat',
			'Drive up maintaining upright torso'
		],
		tips: [
			'Olympic weightlifting style squat',
			'More quad-dominant than low bar',
			'Requires good ankle mobility',
			'Allows deepest squat depth'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Position bar low on rear delts/scapular spine',
			'Wider grip than high bar',
			'More forward lean during descent',
			'Squat to at least parallel',
			'Drive up by extending hips powerfully'
		],
		tips: [
			'Powerlifting style - allows heaviest loads',
			'More hip-dominant, less quad isolation',
			'Better leverages for most people',
			'Requires good shoulder mobility'
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
		],
		difficulty: 'advanced' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension', 'ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Rest bar on front delts in clean grip or cross-arm grip',
			'Keep elbows high to create shelf',
			'Maintain very upright torso throughout',
			'Descend deep - front loading allows this',
			'Drive up keeping elbows high'
		],
		tips: [
			'Most quad-dominant barbell squat',
			'Requires good thoracic mobility',
			'Self-limiting - you cant lean forward',
			'Great for building quad size and upper back strength'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Place safety bar on shoulders using handles',
			'Handles take stress off shoulders/elbows',
			'Squat as normal with upright torso',
			'Bar wants to pitch you forward - fight it',
			'Great for upper back work during squats'
		],
		tips: [
			'Easier on shoulders than straight bar',
			'Forward-pulling forces challenge upper back',
			'Good alternative if injured',
			'Combines benefits of front and back squat'
		]
	},
	{
		name: 'Goblet Squat',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Hold dumbbell vertically at chest (like a goblet)',
			'Cup hands under top of dumbbell',
			'Squat down keeping torso upright',
			'Elbows should go inside knees at bottom',
			'Stand up driving through heels'
		],
		tips: [
			'Excellent squat teaching tool',
			'Front loading enforces upright posture',
			'Good for mobility work',
			'Limited by dumbbell weight for strength'
		]
	},
	{
		name: 'Leg Press',
		equipment: ['Leg Press Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit in machine with back flat against pad',
			'Place feet shoulder-width on platform',
			'Release safety and lower platform toward chest',
			'Descend until knees at 90 degrees or deeper',
			'Press platform up without locking knees'
		],
		tips: [
			'Allows heavy quad loading without spinal stress',
			'Foot position changes emphasis: high=glutes, low=quads',
			'Keep lower back pressed into pad',
			'Dont lock out knees at top'
		]
	},
	{
		name: 'Hack Squat',
		equipment: ['Hack Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Stand on platform with back against pad',
			'Place shoulders under pads',
			'Release safety and descend by bending knees',
			'Go deep for full quad stretch',
			'Drive up through the platform'
		],
		tips: [
			'Machine squat with angled resistance',
			'Very quad-focused due to upright torso',
			'Less lower back stress than free squats',
			'Great for quad isolation and hypertrophy'
		]
	},
	{
		name: 'V-Squat',
		equipment: ['V-Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Stand facing machine with shoulders under pads',
			'Feet on platform in comfortable stance',
			'Release safety and squat down',
			'Descend as deep as mobility allows',
			'Drive up through the platform'
		],
		tips: [
			'Similar to hack squat but facing machine',
			'Allows very deep squats',
			'Good for quad development',
			'Comfortable position for most'
		]
	},
	{
		name: 'Pendulum Squat',
		equipment: ['Pendulum Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Stand on platform with shoulders under pads',
			'Grip handles for stability',
			'Squat down - machine moves in arc',
			'Go as deep as comfortable',
			'Drive up through the movement'
		],
		tips: [
			'Arcing motion is joint-friendly',
			'Hardest at bottom stretch position',
			'Great for lengthened quad training',
			'Excellent quad builder'
		]
	},
	{
		name: 'Belt Squat',
		equipment: ['Belt Squat Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Attach belt around hips connected to weight',
			'Stand on elevated platforms',
			'Hold handles for balance only',
			'Squat down between the platforms',
			'Drive up through legs'
		],
		tips: [
			'Zero spinal loading - all on hips',
			'Perfect for those with back issues',
			'Can squat very deep',
			'Great for high-frequency quad training'
		]
	},
	{
		name: 'Smith Machine Squat',
		equipment: ['Smith Machine'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Position bar on upper back',
			'Feet can be slightly forward of bar',
			'Unrack and squat down',
			'Go to parallel or below',
			'Press back up in fixed path'
		],
		tips: [
			'Fixed path removes balance requirement',
			'Feet forward = more quad isolation',
			'Good for learning squat pattern',
			'Safe for training alone'
		]
	},
	{
		name: 'Leg Extension',
		equipment: ['Leg Extension Machine'],
		muscles: [{ muscle: 'Quads', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit with back against pad, ankles behind roller',
			'Adjust so knee joint aligns with machine pivot',
			'Extend knees to lift weight',
			'Squeeze quads at top',
			'Lower with control'
		],
		tips: [
			'Only exercise that isolates quads completely',
			'Hardest at top - peak contraction focus',
			'Can do single leg for imbalances',
			'Pair with leg curls for balanced training'
		]
	},
	{
		name: 'Sissy Squat',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Quads', activation: 'primary', weighting: 1.0 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['knee_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Stand holding onto support for balance',
			'Rise onto toes and lean torso back',
			'Bend knees and descend, keeping torso-thigh aligned',
			'Lower until quads are fully stretched',
			'Drive up through quads'
		],
		tips: [
			'Extreme quad stretch and isolation',
			'Hardest at bottom - lengthened position',
			'Requires good knee health',
			'Progress by adding weight vest'
		]
	},
	{
		name: 'Bulgarian Split Squat',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'lunge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Place rear foot on bench behind you',
			'Hold dumbbells at sides',
			'Descend by bending front knee',
			'Lower until front thigh is parallel or below',
			'Drive up through front foot'
		],
		tips: [
			'Excellent unilateral quad and glute builder',
			'Front foot position affects emphasis',
			'Keep torso relatively upright',
			'Great for fixing leg imbalances'
		]
	},
	{
		name: 'Walking Lunge',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'lunge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Stand holding dumbbells at sides',
			'Step forward into lunge position',
			'Lower until back knee nearly touches ground',
			'Drive through front foot and step forward',
			'Alternate legs with each step'
		],
		tips: [
			'Continuous movement challenges balance',
			'Longer steps = more glute emphasis',
			'Shorter steps = more quad emphasis',
			'Great for conditioning and hypertrophy'
		]
	},
	{
		name: 'Reverse Lunge',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'lunge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Stand with dumbbells at sides',
			'Step backward into lunge',
			'Lower until back knee nearly touches ground',
			'Drive through front foot to return to standing',
			'Alternate legs or complete all reps on one side'
		],
		tips: [
			'Easier to balance than forward lunges',
			'More glute emphasis than forward lunge',
			'Knee-friendly movement pattern',
			'Good for beginners learning lunge pattern'
		]
	},
	{
		name: 'Step-Up',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'lunge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Stand facing bench with dumbbells at sides',
			'Place one foot on bench',
			'Drive through that foot to step up',
			'Bring other foot up briefly then step down',
			'All reps on one leg then switch'
		],
		tips: [
			'Higher box = more glute activation',
			'Drive through working leg only - no push off',
			'Functional unilateral exercise',
			'Good for athletic development'
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
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Stand holding barbell at thigh level',
			'Push hips back while keeping slight knee bend',
			'Lower bar along legs until hamstring stretch felt',
			'Keep back flat - dont round',
			'Drive hips forward to return to standing'
		],
		tips: [
			'Best hamstring stretch-focused exercise',
			'Hip hinge, not a squat - knees stay relatively straight',
			'Bar stays close to body throughout',
			'Feel the stretch in hamstrings at bottom'
		]
	},
	{
		name: 'Dumbbell Romanian Deadlift',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand holding dumbbells in front of thighs',
			'Push hips back with slight knee bend',
			'Lower dumbbells toward floor',
			'Keep back flat, feel hamstring stretch',
			'Drive hips forward to stand'
		],
		tips: [
			'Dumbbells allow more natural arm position',
			'Good starting point for learning RDL',
			'Can let dumbbells travel outside legs',
			'Focus on hip hinge pattern'
		]
	},
	{
		name: 'Stiff-Leg Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Stand holding barbell with legs straighter than RDL',
			'Hinge at hips keeping legs nearly locked',
			'Lower bar toward floor feeling extreme stretch',
			'Go as low as flexibility allows',
			'Return by driving hips forward'
		],
		tips: [
			'More hamstring stretch than RDL',
			'Straighter legs = more hamstring emphasis',
			'Requires good hamstring flexibility',
			'Be careful not to round lower back'
		]
	},
	{
		name: 'Good Morning',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.65 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Position bar on upper back as for squats',
			'Push hips back with slight knee bend',
			'Hinge forward until torso is near parallel',
			'Feel stretch in hamstrings',
			'Drive hips forward to return upright'
		],
		tips: [
			'Bar position on back increases difficulty',
			'Great for posterior chain strength',
			'Use conservative weight until proficient',
			'Builds hamstring and lower back together'
		]
	},
	{
		name: 'Lying Leg Curl',
		equipment: ['Leg Curl Machine (Lying)'],
		muscles: [{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['knee_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie face down with ankles under roller pad',
			'Align knee joint with machine pivot',
			'Curl heels toward glutes',
			'Squeeze hamstrings at top',
			'Lower with control to full extension'
		],
		tips: [
			'Isolates hamstring knee flexion function',
			'Hardest at bottom stretch position',
			'Hip position affects emphasis - flat hips = more stretch',
			'Pair with hip hinge for complete hamstring training'
		]
	},
	{
		name: 'Seated Leg Curl',
		equipment: ['Leg Curl Machine (Seated)'],
		muscles: [{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['knee_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit with back against pad, legs extended',
			'Position ankle pad above heels',
			'Curl legs by bending knees',
			'Squeeze hamstrings at bottom',
			'Extend with control'
		],
		tips: [
			'Seated position stretches hamstrings more at hip',
			'Greater stretch than lying curl',
			'More research-backed for hamstring hypertrophy',
			'Full ROM is crucial'
		]
	},
	{
		name: 'Nordic Curl',
		equipment: ['Bodyweight', 'GHD Machine (Glute Ham Developer)'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['knee_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Kneel with ankles secured under pad or held',
			'Keep body straight from knees to head',
			'Slowly lower toward ground using hamstrings',
			'Go as low as possible with control',
			'Use hands to push back up or curl back up'
		],
		tips: [
			'One of the best hamstring exercises',
			'Excellent for injury prevention',
			'Progress by controlling longer negative',
			'Eventually work toward full concentric'
		]
	},
	{
		name: 'Glute-Ham Raise',
		equipment: ['GHD Machine (Glute Ham Developer)'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['knee_flexion', 'hip_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Position on GHD with pad above knees',
			'Lower torso forward until parallel to ground',
			'Use hamstrings to curl body back up',
			'Finish by extending hips to vertical',
			'Control the descent'
		],
		tips: [
			'Works both functions of hamstrings',
			'Combines hip extension and knee flexion',
			'Very challenging exercise',
			'Progress from back extensions'
		]
	},
	{
		name: 'Single-Leg Romanian Deadlift',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.75 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Stand on one leg holding dumbbell',
			'Hinge at hip while extending free leg behind',
			'Lower dumbbell toward floor',
			'Keep back flat and hips square',
			'Drive hip forward to return to standing'
		],
		tips: [
			'Excellent for balance and single-leg strength',
			'Keep hips level - dont rotate',
			'Free leg acts as counterbalance',
			'Great for fixing imbalances'
		]
	},
	{
		name: 'Slider Leg Curl',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['knee_flexion', 'hip_extension'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie on back with heels on sliders or towels',
			'Lift hips into bridge position',
			'Slide feet toward glutes by curling heels',
			'Extend legs back out with control',
			'Maintain hip bridge throughout'
		],
		tips: [
			'No equipment needed - just sliders or socks',
			'Combines bridge and leg curl',
			'Great home exercise option',
			'Progress to single-leg version'
		]
	},

	// ==================== GLUTES ====================
	{
		name: 'Hip Thrust',
		equipment: ['Barbell', 'Hip Thrust Bench'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.45 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit on ground with upper back against bench',
			'Roll barbell over hips (use pad for comfort)',
			'Feet flat, about shoulder-width',
			'Drive through heels and extend hips to ceiling',
			'Squeeze glutes at top, lower with control'
		],
		tips: [
			'Best exercise for glute activation',
			'Peak tension at top (shortened position)',
			'Chin tucked, dont hyperextend lower back',
			'Drive through heels, not toes'
		]
	},
	{
		name: 'Dumbbell Hip Thrust',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Position upper back against bench',
			'Place dumbbell on hip crease',
			'Feet flat, shoulder-width apart',
			'Thrust hips up squeezing glutes',
			'Lower with control'
		],
		tips: [
			'Good starting point before barbell',
			'Easier to get into position than barbell',
			'Hold dumbbell in place with hands',
			'Full hip extension at top'
		]
	},
	{
		name: 'Glute Bridge',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie on back with knees bent, feet flat',
			'Arms at sides for stability',
			'Drive through heels and lift hips',
			'Squeeze glutes at top',
			'Lower with control'
		],
		tips: [
			'Foundation glute exercise',
			'Great for learning hip extension',
			'Warm-up or activation exercise',
			'Progress to single-leg or weighted'
		]
	},
	{
		name: 'Single-Leg Glute Bridge',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Lie on back with one knee bent, other leg extended',
			'Drive through working heel to lift hips',
			'Keep hips level - dont let them drop',
			'Squeeze glute at top',
			'Complete all reps then switch legs'
		],
		tips: [
			'Unilateral glute work',
			'Fixes side-to-side imbalances',
			'More challenging than bilateral',
			'Keep hips from rotating'
		]
	},
	{
		name: 'Cable Pull-Through',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Face away from low cable with rope between legs',
			'Step forward, hinge at hips letting cable pull back',
			'Feel stretch in hamstrings and glutes',
			'Drive hips forward to standing',
			'Squeeze glutes at top'
		],
		tips: [
			'Great for learning hip hinge pattern',
			'Constant tension from cable',
			'Good warm-up before deadlifts',
			'Keep back flat throughout'
		]
	},
	{
		name: 'Cable Glute Kickback',
		equipment: ['Cable Machine', 'Ankle Strap'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Attach ankle strap to low cable',
			'Face machine holding for support',
			'Kick leg straight back against resistance',
			'Squeeze glute at back',
			'Control return to start'
		],
		tips: [
			'Isolates glute max',
			'Keep leg relatively straight',
			'Dont arch lower back excessively',
			'Focus on glute contraction'
		]
	},
	{
		name: 'Machine Glute Kickback',
		equipment: ['Glute Kickback Machine'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Position on machine with chest on pad',
			'Place foot on platform',
			'Press platform back by extending hip',
			'Squeeze glute at end range',
			'Control return to start'
		],
		tips: [
			'Machine provides stability for glute focus',
			'Isolated hip extension movement',
			'Good for mind-muscle connection',
			'Can go heavy safely'
		]
	},
	{
		name: 'Frog Pump',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 0.9 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie on back with soles of feet together (frog position)',
			'Knees fall out to sides',
			'Drive through outer edges of feet to lift hips',
			'Squeeze glutes at top',
			'Lower and repeat for high reps'
		],
		tips: [
			'Isolates glutes by reducing hamstring involvement',
			'Great activation or finisher exercise',
			'High reps work well (20-30+)',
			'Feet position reduces hamstring contribution'
		]
	},
	{
		name: 'Sumo Deadlift',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Adductors', activation: 'secondary', weighting: 0.65 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.45 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'mixed' as const,
		instructions: [
			'Stand with wide stance, toes pointed out',
			'Grip bar inside legs (narrow grip)',
			'Push knees out over toes',
			'Drive through floor extending hips and knees',
			'Stand tall at top, lower with control'
		],
		tips: [
			'Wide stance shortens range of motion',
			'More quad and adductor involvement than conventional',
			'Better for those with long torsos',
			'Keep chest up and back flat'
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
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'mixed' as const,
		instructions: [
			'Stand with feet hip-width, bar over mid-foot',
			'Hinge and grip bar just outside legs',
			'Set back flat, chest up',
			'Drive through floor, extending hips and knees together',
			'Stand tall at top, reverse to lower'
		],
		tips: [
			'The ultimate posterior chain exercise',
			'Keep bar close to body throughout',
			'Dont let back round',
			'Think push the floor away'
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
		],
		difficulty: 'beginner' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand inside trap bar, feet hip-width',
			'Grip handles at sides with neutral grip',
			'Set back flat, chest up',
			'Drive through floor to stand',
			'Lower with control back to floor'
		],
		tips: [
			'Neutral grip and center loading reduces lower back stress',
			'More quad involvement than conventional',
			'Easier to learn than barbell deadlift',
			'Great for general strength and athleticism'
		]
	},
	{
		name: 'Hip Abduction (Machine)',
		equipment: ['Hip Abductor Machine'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 0.85 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['hip_abduction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit in machine with outer thighs against pads',
			'Press legs outward against resistance',
			'Hold briefly at end range',
			'Control return to starting position',
			'Keep back against pad'
		],
		tips: [
			'Targets gluteus medius and upper glute max',
			'Good for glute activation and hypertrophy',
			'Lean forward to shift emphasis',
			'Can use as warm-up or finisher'
		]
	},
	{
		name: 'Banded Clamshell',
		equipment: ['Resistance Bands'],
		muscles: [{ muscle: 'Glutes', activation: 'primary', weighting: 0.85 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['hip_external_rotation', 'hip_abduction'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie on side with band around thighs above knees',
			'Keep feet together, knees bent 90 degrees',
			'Lift top knee up like opening a clamshell',
			'Keep hips stacked - dont rotate back',
			'Lower with control and repeat'
		],
		tips: [
			'Excellent glute med activation',
			'Great warm-up exercise',
			'Good for hip stability and health',
			'Keep pelvis stable throughout'
		]
	},

	// ==================== CALVES ====================
	{
		name: 'Standing Calf Raise (Machine)',
		equipment: ['Calf Raise Machine (Standing)'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Position shoulders under pads, balls of feet on platform',
			'Let heels drop below platform for full stretch',
			'Rise up onto toes as high as possible',
			'Pause at top and squeeze calves',
			'Lower with control to full stretch'
		],
		tips: [
			'Straight legs emphasizes gastrocnemius',
			'Full ROM crucial - stretch at bottom, squeeze at top',
			'Pause at both ends for best results',
			'Train calves frequently - they recover fast'
		]
	},
	{
		name: 'Seated Calf Raise',
		equipment: ['Calf Raise Machine (Seated)'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit with knees under pad, balls of feet on platform',
			'Let heels drop for full stretch',
			'Press up through balls of feet',
			'Rise as high as possible, squeezing calves',
			'Lower with control'
		],
		tips: [
			'Bent knees emphasizes soleus',
			'Soleus contributes significantly to calf size',
			'Both standing and seated needed for full development',
			'Can use heavier weight than standing'
		]
	},
	{
		name: 'Donkey Calf Raise',
		equipment: ['Calf Raise Machine (Donkey)'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 1.0 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Position in machine with hips hinged, pad on lower back',
			'Balls of feet on platform, legs straight',
			'Let heels drop for deep stretch',
			'Rise up as high as possible',
			'Squeeze at top, lower with control'
		],
		tips: [
			'Classic bodybuilding calf exercise',
			'Hip flexion may increase gastrocnemius stretch',
			'Allows heavy loading safely',
			'Focus on full range of motion'
		]
	},
	{
		name: 'Leg Press Calf Raise',
		equipment: ['Leg Press Machine'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 0.95 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit in leg press with balls of feet on bottom of platform',
			'Straighten legs (but dont lock)',
			'Let toes point back for stretch',
			'Press through balls of feet to extend ankles',
			'Control the return'
		],
		tips: [
			'Use existing leg press machine for calves',
			'Keep legs relatively straight',
			'Safety catches prevent slipping',
			'Good option if no dedicated calf machine'
		]
	},
	{
		name: 'Smith Machine Calf Raise',
		equipment: ['Smith Machine'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 0.95 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set bar on upper traps, stand on raised surface',
			'Balls of feet on edge, heels hanging off',
			'Let heels drop for stretch',
			'Rise up on toes as high as possible',
			'Lower with control'
		],
		tips: [
			'Smith machine removes balance requirement',
			'Need raised surface for ROM',
			'Good heavy calf option',
			'Keep knees locked for gastrocnemius focus'
		]
	},
	{
		name: 'Single-Leg Calf Raise',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Calves', activation: 'primary', weighting: 0.9 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['ankle_plantarflexion'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Stand on edge of step on one foot',
			'Hold wall or rail for balance',
			'Let heel drop below step for stretch',
			'Rise up on toes as high as possible',
			'Complete all reps then switch legs'
		],
		tips: [
			'Bodyweight unilateral calf work',
			'Hold dumbbell to add load',
			'Full ROM is critical',
			'Good for fixing calf imbalances'
		]
	},

	// ==================== ADDUCTORS ====================
	{
		name: 'Hip Adduction (Machine)',
		equipment: ['Hip Adductor Machine'],
		muscles: [{ muscle: 'Adductors', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['hip_adduction'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit with inner thighs against pads, legs spread',
			'Squeeze legs together against resistance',
			'Hold briefly at end range',
			'Return to start with control',
			'Keep back against pad'
		],
		tips: [
			'Targets adductor group directly',
			'Hardest at stretched (legs apart) position',
			'Good for inner thigh development',
			'Often neglected but important for leg health'
		]
	},
	{
		name: 'Copenhagen Adductor',
		equipment: ['Flat Bench'],
		muscles: [{ muscle: 'Adductors', activation: 'primary', weighting: 1.0 }],
		difficulty: 'advanced' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['hip_adduction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'high' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Side plank position with top leg on bench',
			'Bottom leg hangs beneath bench',
			'Lift bottom leg up to meet top leg',
			'Lower with control',
			'Maintain side plank throughout'
		],
		tips: [
			'Excellent adductor strengthening exercise',
			'Used for injury prevention in athletes',
			'Very challenging - progress gradually',
			'Also works core stability'
		]
	},
	{
		name: 'Cable Adduction',
		equipment: ['Cable Machine', 'Ankle Strap'],
		muscles: [{ muscle: 'Adductors', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['hip_adduction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Attach ankle strap to low cable',
			'Stand sideways to machine, strap on near leg',
			'Pull leg across body against resistance',
			'Control return to stretched position',
			'Complete reps then switch legs'
		],
		tips: [
			'Constant cable tension throughout',
			'Good for isolated adductor work',
			'Hold onto machine for balance',
			'Keep torso stable'
		]
	},
	{
		name: 'Sumo Squat',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Adductors', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension', 'hip_adduction'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand wide with toes pointed out 45 degrees',
			'Hold dumbbell vertically between legs',
			'Squat down keeping knees over toes',
			'Descend until thighs parallel or lower',
			'Drive up through heels'
		],
		tips: [
			'Wide stance increases adductor involvement',
			'Good inner thigh work while squatting',
			'Keep chest up and back flat',
			'Push knees out over toes'
		]
	},

	// ==================== ABS ====================
	{
		name: 'Hanging Leg Raise',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion', 'hip_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Hang from bar with arms extended',
			'Keep legs straight or slightly bent',
			'Raise legs by curling pelvis up',
			'Continue until legs parallel or higher',
			'Lower with control'
		],
		tips: [
			'Focus on curling pelvis - not just hip flexion',
			'Control the swing - no momentum',
			'Straight legs harder than bent knees',
			'Excellent for lower abs'
		]
	},
	{
		name: 'Hanging Knee Raise',
		equipment: ['Pull-up Bar'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.9 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion', 'hip_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Hang from bar with arms extended',
			'Bend knees and draw them toward chest',
			'Curl pelvis up at top for full ab contraction',
			'Lower with control',
			'Minimize swinging'
		],
		tips: [
			'Easier progression to leg raises',
			'Still focus on pelvic curl',
			'Great entry point for hanging ab work',
			'Build up to straight leg version'
		]
	},
	{
		name: 'Cable Crunch',
		equipment: ['Cable Machine', 'Rope Attachment'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Kneel facing cable with rope behind head',
			'Keep hips stationary throughout',
			'Crunch down by flexing spine',
			'Bring elbows toward thighs',
			'Return with control'
		],
		tips: [
			'Loaded ab exercise - great for hypertrophy',
			'Move through spine, not hips',
			'Keep hips still to isolate abs',
			'Progressive overload possible'
		]
	},
	{
		name: 'Machine Crunch',
		equipment: ['Ab Crunch Machine'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.95 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit in machine with feet secured',
			'Grip handles or place arms on pads',
			'Crunch forward by flexing spine',
			'Squeeze abs at contracted position',
			'Return with control'
		],
		tips: [
			'Machine provides consistent resistance',
			'Easy to track and progress',
			'Good for beginners',
			'Focus on spinal flexion not hip flexion'
		]
	},
	{
		name: 'Ab Wheel Rollout',
		equipment: ['Ab Wheel'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Kneel with hands on ab wheel',
			'Roll forward extending body',
			'Go as far as possible while maintaining flat back',
			'Use abs to pull wheel back to start',
			'Keep hips from sagging'
		],
		tips: [
			'Excellent anti-extension exercise',
			'Hardest at extended position',
			'Start with small ROM, progress to full extension',
			'Advanced: standing rollouts'
		]
	},
	{
		name: 'Plank',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_stabilization'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Start in push-up position or on forearms',
			'Keep body in straight line from head to heels',
			'Engage abs to prevent hips from sagging',
			'Hold for time',
			'Breathe steadily throughout'
		],
		tips: [
			'Foundation anti-extension exercise',
			'Quality over duration - maintain position',
			'Squeeze glutes to support position',
			'Progress by adding weight or instability'
		]
	},
	{
		name: 'Dead Bug',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.85 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_stabilization'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie on back with arms pointing up, knees bent 90 degrees',
			'Press lower back into floor (posterior pelvic tilt)',
			'Extend opposite arm and leg while keeping back flat',
			'Return to start and repeat other side',
			'Never let lower back arch up'
		],
		tips: [
			'Excellent core stability exercise',
			'Teaches maintaining neutral spine',
			'Low back should stay pressed to floor',
			'Great for rehabilitation and warming up'
		]
	},
	{
		name: 'Hollow Body Hold',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.9 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie on back with arms overhead, legs extended',
			'Press lower back into floor',
			'Lift shoulders and legs off ground',
			'Create banana shape with body',
			'Hold position for time'
		],
		tips: [
			'Gymnastics foundation exercise',
			'Lower back must stay on floor',
			'Regression: bend knees or arms',
			'Progression: rock back and forth (hollow rock)'
		]
	},
	{
		name: 'Reverse Crunch',
		equipment: ['Flat Bench'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.95 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie on bench or floor with hands anchored',
			'Bend knees and lift feet off ground',
			'Curl pelvis toward chest lifting hips',
			'Squeeze abs at top',
			'Lower with control'
		],
		tips: [
			'Targets lower abs effectively',
			'Movement is pelvis curling, not just hip flexion',
			'Keep upper back on bench',
			'Good alternative to leg raises'
		]
	},
	{
		name: 'Lying Leg Raise',
		equipment: ['Flat Bench'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_flexion', 'spine_flexion'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie flat on bench or floor',
			'Place hands under lower back or grip bench',
			'Keep legs straight and lift toward ceiling',
			'Lower with control stopping before touching ground',
			'Press lower back down throughout'
		],
		tips: [
			'Easier than hanging leg raises',
			'Keep lower back pressed down',
			'Bend knees slightly if hamstrings tight',
			'Focus on controlled lowering'
		]
	},
	{
		name: 'V-Up',
		equipment: ['Bodyweight'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 0.9 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion', 'hip_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie flat with arms extended overhead',
			'Simultaneously raise legs and torso',
			'Reach hands toward toes forming V shape',
			'Balance briefly on glutes',
			'Lower with control to starting position'
		],
		tips: [
			'Combines crunch and leg raise',
			'Challenges entire rectus abdominis',
			'Keep legs and arms straight',
			'Control the movement - no momentum'
		]
	},
	{
		name: 'Toes-to-Bar',
		equipment: ['Pull-up Bar'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_flexion', 'hip_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Hang from bar with arms extended',
			'Keep legs straight',
			'Swing legs up touching toes to bar',
			'Control the descent',
			'Minimize excessive swinging'
		],
		tips: [
			'Advanced hanging ab movement',
			'Requires strength and flexibility',
			'Some kipping is normal',
			'Master hanging leg raises first'
		]
	},

	// ==================== OBLIQUES ====================
	{
		name: 'Side Plank',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['spine_lateral_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Lie on side with forearm on ground under shoulder',
			'Stack feet or stagger for stability',
			'Lift hips creating straight line from head to feet',
			'Hold position for time',
			'Switch sides'
		],
		tips: [
			'Foundation lateral core stability exercise',
			'Keep hips from dropping',
			'Stack shoulders directly over elbow',
			'Progress by raising top leg or arm'
		]
	},
	{
		name: 'Pallof Press',
		equipment: ['Cable Machine', 'D-Handle Attachment'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['spine_anti_rotation'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Stand sideways to cable at chest height',
			'Hold handle at chest with both hands',
			'Press handle straight out in front',
			'Resist rotation, hold extended position',
			'Return to chest and repeat'
		],
		tips: [
			'Anti-rotation exercise - resist the twist',
			'Excellent for core stability',
			'Keep hips square throughout',
			'Dont let cable pull you into rotation'
		]
	},
	{
		name: 'Russian Twist',
		equipment: ['Medicine Ball'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'rotation' as const,
		plane: 'transverse' as const,
		jointActions: ['spine_rotation'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Sit with knees bent, lean back 45 degrees',
			'Hold medicine ball at chest',
			'Rotate torso and touch ball to floor beside hip',
			'Rotate to other side',
			'Keep feet grounded or lifted for difficulty'
		],
		tips: [
			'Rotate through spine, not just arms',
			'Keep chest up throughout',
			'Lifting feet increases difficulty',
			'Control the movement - no momentum'
		]
	},
	{
		name: 'Cable Woodchop',
		equipment: ['Cable Machine', 'D-Handle Attachment'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.45 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'rotation' as const,
		plane: 'transverse' as const,
		jointActions: ['spine_rotation', 'spine_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable high, stand sideways to machine',
			'Grip handle with both hands above shoulder',
			'Pull handle diagonally down and across body',
			'Rotate through hips and core',
			'Control return to starting position'
		],
		tips: [
			'Mimics chopping motion',
			'Can do high-to-low or low-to-high',
			'Rotate from core, not just arms',
			'Athletic rotational movement'
		]
	},
	{
		name: 'Rotary Torso Machine',
		equipment: ['Rotary Torso Machine'],
		muscles: [{ muscle: 'Obliques', activation: 'primary', weighting: 0.9 }],
		difficulty: 'beginner' as const,
		movementPattern: 'rotation' as const,
		plane: 'transverse' as const,
		jointActions: ['spine_rotation'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Sit in machine with chest against pad',
			'Lock hips in place',
			'Rotate torso against resistance',
			'Control return to start',
			'Complete reps then switch direction'
		],
		tips: [
			'Isolated rotational core work',
			'Machine locks hips for pure spinal rotation',
			'Use lighter weight and control',
			'Good for building rotational strength'
		]
	},
	{
		name: 'Bicycle Crunch',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.7 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'rotation' as const,
		plane: 'multi' as const,
		jointActions: ['spine_rotation', 'spine_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie on back with hands behind head',
			'Lift shoulders and feet off ground',
			'Bring opposite elbow toward opposite knee',
			'Extend other leg straight',
			'Alternate sides in pedaling motion'
		],
		tips: [
			'High EMG activation for obliques and abs',
			'Rotate through spine, not just elbows',
			'Keep shoulder blades off ground throughout',
			'Control the movement - no rushing'
		]
	},
	{
		name: 'Landmine Rotation',
		equipment: ['Barbell', 'Landmine Attachment'],
		muscles: [
			{ muscle: 'Obliques', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'rotation' as const,
		plane: 'transverse' as const,
		jointActions: ['spine_rotation'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Stand holding end of barbell at arm length',
			'Start with bar at one hip',
			'Rotate bar in arc to other hip',
			'Keep arms relatively straight',
			'Rotate through core and hips'
		],
		tips: [
			'Loaded rotational movement',
			'Athletic power development',
			'Control the arc - dont let bar control you',
			'Great for sports performance'
		]
	},
	{
		name: 'Side Bend (Dumbbell)',
		equipment: ['Dumbbell'],
		muscles: [{ muscle: 'Obliques', activation: 'primary', weighting: 0.85 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['spine_lateral_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Stand holding dumbbell in one hand',
			'Keep other hand at side or on hip',
			'Bend sideways toward weighted side',
			'Return to upright using opposite oblique',
			'Complete reps then switch sides'
		],
		tips: [
			'Targets lateral core muscles',
			'May increase waist width if done heavy',
			'Use for oblique isolation',
			'Keep hips still - move only at spine'
		]
	},

	// ==================== LOWER BACK ====================
	{
		name: 'Back Extension',
		equipment: ['Roman Chair'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_extension', 'hip_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Position hips on pad, ankles behind rollers',
			'Cross arms on chest or behind head',
			'Lower torso toward ground',
			'Extend back to return to starting position',
			'Keep controlled throughout'
		],
		tips: [
			'Foundation lower back exercise',
			'Can be hip-dominant or back-dominant',
			'Rounding at bottom increases lower back work',
			'Dont hyperextend at top'
		]
	},
	{
		name: 'Weighted Back Extension',
		equipment: ['Roman Chair', 'Weight Plates'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.45 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_extension', 'hip_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Hold weight plate against chest',
			'Position on roman chair as normal',
			'Lower with control',
			'Extend back to starting position',
			'Maintain weight position throughout'
		],
		tips: [
			'Progressive overload for lower back',
			'Keep weight close to body',
			'Can hold plate behind head for more difficulty',
			'Build up weight gradually'
		]
	},
	{
		name: 'Machine Back Extension',
		equipment: ['Back Extension Machine'],
		muscles: [{ muscle: 'Lower Back', activation: 'primary', weighting: 0.95 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit in machine with back against pad',
			'Adjust pad to align with lower back',
			'Press back against pad to extend spine',
			'Control return to starting position',
			'Keep movement in lower back'
		],
		tips: [
			'Isolated lower back training',
			'Machine provides consistent resistance',
			'Good for those with hip issues',
			'Easy to track progress'
		]
	},
	{
		name: 'Reverse Hyperextension',
		equipment: ['Reverse Hyper Machine'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'spine_extension'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie face down with hips on pad, holding handles',
			'Let legs hang down with strap attached',
			'Swing legs up and back using glutes and lower back',
			'Raise until body is straight or slightly extended',
			'Control the return allowing stretch'
		],
		tips: [
			'Decompresses spine while strengthening',
			'Great for lower back health',
			'Invented by Louie Simmons at Westside',
			'Can use light weight for rehab'
		]
	},
	{
		name: 'Superman',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_extension', 'hip_extension', 'shoulder_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie face down with arms extended overhead',
			'Simultaneously lift arms, chest, and legs off ground',
			'Hold briefly at top',
			'Lower with control',
			'Keep neck neutral - look at floor'
		],
		tips: [
			'Simple bodyweight lower back exercise',
			'Activates entire posterior chain',
			'Can alternate arms and legs (swimming)',
			'Good warm-up or finisher'
		]
	},
	{
		name: 'Bird Dog',
		equipment: ['Bodyweight'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spine_stabilization', 'hip_extension', 'shoulder_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Start on hands and knees',
			'Keep spine neutral throughout',
			'Extend opposite arm and leg straight out',
			'Hold briefly maintaining balance',
			'Return and switch sides'
		],
		tips: [
			'Excellent core stabilization exercise',
			'Keep hips level - no rotation',
			'Focus on maintaining flat back',
			'Great for lower back health and warm-up'
		]
	},

	// ==================== NECK ====================
	{
		name: 'Neck Curl',
		equipment: ['Neck Harness', 'Weight Plates'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['neck_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Attach weight to neck harness',
			'Sit on bench leaning forward or lie face up',
			'Let head drop back to stretch',
			'Curl head forward bringing chin toward chest',
			'Lower with control'
		],
		tips: [
			'Targets front of neck (sternocleidomastoid)',
			'Start very light - neck is sensitive',
			'Slow controlled movements only',
			'Important for neck balance with extension'
		]
	},
	{
		name: 'Neck Extension',
		equipment: ['Neck Harness', 'Weight Plates'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['neck_extension'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Attach weight to neck harness',
			'Stand or kneel with torso bent forward',
			'Let head drop forward',
			'Extend head up and back against weight',
			'Lower with control'
		],
		tips: [
			'Targets back of neck muscles',
			'Most common neck training movement',
			'Build up weight gradually over weeks',
			'Essential for contact sports and aesthetics'
		]
	},
	{
		name: 'Plate-Loaded Neck Flexion',
		equipment: ['Weight Plates', 'Flat Bench'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 0.9 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['neck_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie face up on bench with head off edge',
			'Place folded towel on forehead',
			'Balance weight plate on towel',
			'Lower head back, then curl forward',
			'Use hands to stabilize plate'
		],
		tips: [
			'No harness needed option',
			'Use light weight - neck is vulnerable',
			'Towel protects and pads forehead',
			'Good entry point for neck training'
		]
	},
	{
		name: 'Plate-Loaded Neck Extension',
		equipment: ['Weight Plates', 'Flat Bench'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 0.9 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['neck_extension'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Lie face down on bench with head off edge',
			'Place folded towel on back of head',
			'Balance weight plate on towel',
			'Lower head down, then extend back up',
			'Hands stabilize plate'
		],
		tips: [
			'Simple neck extension without harness',
			'Start light - maybe 5-10 lbs',
			'Control the movement - no jerking',
			'Progress slowly over weeks'
		]
	},
	{
		name: 'Neck Lateral Flexion',
		equipment: ['Neck Harness', 'Weight Plates'],
		muscles: [{ muscle: 'Neck', activation: 'primary', weighting: 0.9 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['neck_lateral_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'low' as const,
		unilateral: true,
		gripType: 'none' as const,
		instructions: [
			'Lie on side with head hanging off bench',
			'Hold weight plate against side of head with hand',
			'Let head drop toward floor',
			'Flex neck to lift head laterally',
			'Complete reps then switch sides'
		],
		tips: [
			'Often neglected movement direction',
			'Important for complete neck development',
			'Can use hand resistance instead of weight',
			'Train both sides equally'
		]
	},

	// ==================== NEW EXERCISES (Data Audit Additions) ====================

	// ---- CHEST ----
	{
		name: 'Floor Press',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Lie on floor with knees bent, feet flat',
			'Unrack barbell or have partner hand it off',
			'Lower bar until upper arms touch floor',
			'Pause briefly on floor',
			'Press bar back up explosively'
		],
		tips: [
			'Removes leg drive and limits ROM for lockout strength',
			'Great for overloading the top half of the press',
			'Reduces shoulder stress by limiting depth',
			'Popular powerlifting accessory movement'
		]
	},
	{
		name: 'Dumbbell Floor Press',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.45 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Lie on floor with knees bent',
			'Hold dumbbells at chest height',
			'Lower until upper arms rest on floor',
			'Pause, then press back up'
		],
		tips: [
			'Easier setup than barbell floor press',
			'Neutral grip is easier on shoulders',
			'Good for home gym training without a bench',
			'Teaches proper pause and pressing mechanics'
		]
	},
	{
		name: 'Svend Press',
		equipment: ['Weight Plates'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Hold two plates pressed together at chest level',
			'Squeeze plates together with palms',
			'Press plates forward until arms are extended',
			'Slowly return to chest while maintaining squeeze'
		],
		tips: [
			'Constant adduction tension throughout',
			'Great burnout finisher for chest',
			'Focus on squeezing plates together hard',
			'Light weight - the squeeze is what matters'
		]
	},

	// ---- SHOULDERS ----
	{
		name: 'Dumbbell Y-Raise',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Side Delts', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'multi' as const,
		jointActions: ['shoulder_abduction', 'shoulder_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Lie chest-down on incline bench set to 30-45 degrees',
			'Hold light dumbbells with arms hanging straight down',
			'Raise arms up and out to form a Y shape overhead',
			'Lower with control'
		],
		tips: [
			'Combines abduction and flexion for unique delt stimulus',
			'Great for lower trap and rear/side delt development',
			'Use very light weight - harder than it looks',
			'Keep slight bend in elbows throughout'
		]
	},

	// ---- ARMS (Biceps) ----
	{
		name: 'Bayesian Cable Curl',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'underhand' as const,
		instructions: [
			'Set cable at lowest position with D-handle',
			'Face away from machine, stagger stance',
			'Let arm extend behind body for maximum bicep stretch',
			'Curl handle forward and up toward shoulder',
			'Lower with control back to full stretch'
		],
		tips: [
			'Best cable exercise for bicep long head stretch',
			'Constant tension in the lengthened position',
			'Popularized by Jeff Nippard for stretch-mediated hypertrophy',
			'Keep upper arm stationary - elbow stays back'
		]
	},
	{
		name: 'Overhead Cable Curl',
		equipment: ['Cable Machine'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.25 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'frontal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Stand between two high cables with D-handles',
			'Arms out to sides at shoulder height, palms up',
			'Curl handles toward head by flexing elbows',
			'Squeeze biceps at peak contraction',
			'Extend arms back to start position'
		],
		tips: [
			'Classic bodybuilding pose curl (front double bicep)',
			'Constant cable tension throughout ROM',
			'Great for bicep peak training',
			'Keep elbows at shoulder height throughout'
		]
	},
	// ---- ARMS (Triceps) ----
	{
		name: 'EZ Bar Skull Crusher',
		equipment: ['EZ Curl Bar', 'Flat Bench'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Lie on bench holding EZ bar overhead',
			'Keep upper arms vertical',
			'Lower bar toward forehead by bending elbows',
			'Extend elbows to press bar back up'
		],
		tips: [
			'EZ bar reduces wrist strain compared to straight bar',
			'Can lower to forehead or behind head for more stretch',
			'Keep elbows pointing at ceiling, not flaring',
			'Great for long head tricep development'
		]
	},
	{
		name: 'Single-Arm Cable Pushdown',
		equipment: ['Cable Machine', 'D-Handle Attachment'],
		muscles: [{ muscle: 'Triceps', activation: 'primary', weighting: 1.0 }],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_extension'],
		forceProfile: 'constant' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'low' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable at highest position with D-handle',
			'Stand facing machine, grip handle with one hand',
			'Keep elbow pinned to side',
			'Press handle down until arm fully extended',
			'Control return, complete all reps then switch'
		],
		tips: [
			'Fixes left-right tricep imbalances',
			'Can rotate grip during movement for extra contraction',
			'Constant cable tension throughout',
			'Good for mind-muscle connection'
		]
	},

	// ---- BACK ----
	{
		name: 'Single-Arm Cable Row',
		equipment: ['Cable Machine', 'D-Handle Attachment'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Set cable at mid-height with D-handle',
			'Stagger stance facing machine',
			'Row handle toward hip, squeezing lat',
			'Allow full stretch at the bottom',
			'Complete all reps then switch sides'
		],
		tips: [
			'Allows rotation for extended ROM',
			'Constant cable tension throughout',
			'Great for fixing left-right imbalances',
			'Can adjust cable height to target different angles'
		]
	},
	{
		name: 'Helms Row',
		equipment: ['Dumbbell', 'Incline Bench'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Rear Delts', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension', 'elbow_flexion', 'scapular_retraction'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set incline bench to 30-45 degrees',
			'Lie chest-down with dumbbells hanging below',
			'Row both dumbbells toward hips simultaneously',
			'Squeeze shoulder blades at top',
			'Lower with control to full arm extension'
		],
		tips: [
			'Chest support eliminates lower back fatigue',
			'Great alternative to barbell rows for those with back issues',
			'Named after Eric Helms',
			'Can go heavier since lower back is not limiting factor'
		]
	},
	{
		name: 'Single-Arm Lat Pulldown',
		equipment: ['Lat Pulldown Machine', 'D-Handle Attachment'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.55 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.45 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_adduction', 'shoulder_extension', 'elbow_flexion'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Attach D-handle to lat pulldown',
			'Sit with thighs secured under pads',
			'Pull handle down toward shoulder',
			'Full stretch at top, full contraction at bottom',
			'Complete all reps then switch sides'
		],
		tips: [
			'Excellent for fixing lat imbalances',
			'Greater ROM than bilateral pulldowns',
			'Can add slight rotation for extra stretch',
			'Great mind-muscle connection'
		]
	},

	// ---- LEGS (Quads) ----
	{
		name: 'Spanish Squat',
		equipment: ['Resistance Bands'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['knee_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Loop band behind knees, anchor to squat rack',
			'Lean back against the band tension',
			'Squat down keeping shins vertical',
			'Let band pull knees forward while you sit back',
			'Stand back up by extending knees'
		],
		tips: [
			'Band keeps constant quad tension at depth',
			'Excellent for patellar tendon rehab and prehab',
			'Vertical shins make it very quad-dominant',
			'Popular in physiotherapy and knee rehab'
		]
	},

	// ---- LEGS (Hamstrings) ----
	// ---- LEGS (Glutes) ----
	{
		name: 'B-Stance Hip Thrust',
		equipment: ['Barbell', 'Hip Thrust Bench'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Set up as normal hip thrust',
			'Stagger one foot slightly forward (heel of back foot lifts)',
			'Working leg stays flat, other foot acts as kickstand',
			'Thrust hips up, feeling the glute of the working leg',
			'Complete reps then switch stance'
		],
		tips: [
			'Bridges gap between bilateral and single-leg hip thrusts',
			'Back foot provides stability but minimal force',
			'About 70-80% of load goes through the working leg',
			'Easier to load than full single-leg hip thrust'
		]
	},
	{
		name: 'Deficit Reverse Lunge',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'lunge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: true,
		gripType: 'neutral' as const,
		instructions: [
			'Stand on a small platform or step (4-6 inches)',
			'Hold dumbbells at sides',
			'Step one foot back and down off the platform',
			'Lower until back knee nearly touches ground',
			'Drive through front foot to step back up'
		],
		tips: [
			'Deficit increases glute stretch and ROM',
			'More glute-dominant than standard reverse lunge',
			'Keep torso slightly forward to bias glutes',
			'Great for glute hypertrophy with moderate load'
		]
	},

	// ---- LEGS (Calves) ----
	// ---- LEGS (Adductors) ----
	{
		name: 'Sumo Goblet Squat',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Adductors', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension', 'hip_adduction'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Hold dumbbell at chest in goblet position',
			'Take a wide stance with toes pointed out 30-45 degrees',
			'Squat down between legs, keeping torso upright',
			'Descend until thighs are at or below parallel',
			'Drive through feet to stand'
		],
		tips: [
			'Wide stance emphasizes adductors',
			'More adductor and glute work than standard goblet squat',
			'Keep knees tracking over toes',
			'Good beginner exercise for adductor development'
		]
	},

	// ---- BACK (more) ----
	{
		name: 'Rack Pull',
		equipment: ['Barbell', 'Power Rack'],
		muscles: [
			{ muscle: 'Lower Back', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.5 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'mixed' as const,
		instructions: [
			'Set safety pins at knee height or just below',
			'Set up as you would for a deadlift',
			'Pull bar from pins to lockout',
			'Squeeze glutes and traps at top',
			'Lower bar back to pins with control'
		],
		tips: [
			'Overloads the lockout portion of the deadlift',
			'Great for trap and upper back development',
			'Can handle heavier weight than full deadlifts',
			'Useful for grip training with heavy loads'
		]
	},
	{
		name: 'Dumbbell Pullover',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Lats', activation: 'primary', weighting: 0.85 },
			{ muscle: 'Chest', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'vertical_pull' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Lie across a flat bench with upper back supported',
			'Hold dumbbell overhead with both hands',
			'Lower dumbbell behind head in an arc',
			'Feel the stretch through lats and chest',
			'Pull dumbbell back over chest'
		],
		tips: [
			'Classic old-school exercise for lat and chest stretch',
			'Keep slight bend in elbows throughout',
			'Deep stretch at bottom is the key stimulus',
			'Can bias lats or chest depending on elbow angle'
		]
	},

	// ---- CHEST (more) ----
	{
		name: 'Squeeze Press',
		equipment: ['Dumbbell', 'Flat Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.5 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'horizontal_push' as const,
		plane: 'sagittal' as const,
		jointActions: ['shoulder_horizontal_adduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Lie on bench with two dumbbells pressed together',
			'Keep dumbbells touching and squeeze inward throughout',
			'Press up while maintaining inward squeeze',
			'Lower to chest, never letting dumbbells separate'
		],
		tips: [
			'Constant adduction tension maximizes inner chest activation',
			'Lighter weight needed due to isometric adduction demand',
			'Great finisher after pressing movements',
			'Keep squeezing inward - that is the key stimulus'
		]
	},
	{
		name: 'Incline Cable Flye',
		equipment: ['Dual Cable Crossover', 'Adjustable Bench'],
		muscles: [
			{ muscle: 'Chest', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Front Delts', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'transverse' as const,
		jointActions: ['shoulder_horizontal_adduction'],
		forceProfile: 'constant' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Set bench to 30-45 degree incline between cable towers',
			'Set cables at lowest position',
			'Lie back, grab handles with arms out to sides',
			'Bring handles together over upper chest in arc motion',
			'Lower with control to deep stretch'
		],
		tips: [
			'Constant cable tension throughout ROM',
			'Better upper chest activation than flat cable flyes',
			'Combines incline angle with stretch-focused isolation',
			'Excellent for upper chest development'
		]
	},

	// ---- SHOULDERS (more) ----
	{
		name: 'Behind-the-Neck Press',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Front Delts', activation: 'primary', weighting: 0.9 },
			{ muscle: 'Side Delts', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Triceps', activation: 'secondary', weighting: 0.55 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'vertical_push' as const,
		plane: 'frontal' as const,
		jointActions: ['shoulder_abduction', 'elbow_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Sit or stand with barbell on upper traps (behind head)',
			'Grip slightly wider than shoulder width',
			'Press bar straight up to lockout',
			'Lower behind head to ear level or slightly below',
			'Do not descend too deep if mobility is limited'
		],
		tips: [
			'Requires good shoulder mobility - do not force it',
			'Higher side delt activation than front press',
			'Use lighter weight than standard overhead press',
			'Stop if any shoulder discomfort'
		]
	},
	// ---- CORE ----
	{
		name: 'Kneeling Ab Rollout',
		equipment: ['Ab Wheel'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.35 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['anti_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Kneel on floor with ab wheel in front',
			'Roll wheel forward, extending body toward floor',
			'Go as far as you can maintain a flat back',
			'Pull wheel back to starting position using abs'
		],
		tips: [
			'Anti-extension pattern - resist spinal extension',
			'Keep core braced throughout, do not let back arch',
			'Start with small range and increase over time',
			'Harder than crunches - great for ab hypertrophy'
		]
	},
	{
		name: 'Standing Ab Rollout',
		equipment: ['Ab Wheel'],
		muscles: [
			{ muscle: 'Abs', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Obliques', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['anti_extension'],
		forceProfile: 'descending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Stand with ab wheel on floor in front',
			'Hinge forward and place wheel on ground',
			'Roll wheel forward, extending body as far as possible',
			'Pull wheel back to standing using abs'
		],
		tips: [
			'Significantly harder than kneeling version',
			'Only attempt after mastering kneeling rollouts',
			'One of the most demanding ab exercises',
			'Requires excellent core strength and body control'
		]
	},
	{
		name: 'Weighted Decline Crunch',
		equipment: ['Decline Bench', 'Weight Plates'],
		muscles: [{ muscle: 'Abs', activation: 'primary', weighting: 1.0 }],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['spinal_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'low' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Sit on decline bench with feet hooked under pads',
			'Hold weight plate across chest or behind head',
			'Lower upper body back until you feel a stretch',
			'Crunch up by flexing spine, not hinging at hips',
			'Squeeze abs at top'
		],
		tips: [
			'Decline angle increases ROM compared to flat crunches',
			'Holding weight adds progressive overload for abs',
			'Focus on spinal flexion, not hip flexion',
			'Great for ab hypertrophy with measurable progression'
		]
	},

	// ---- FOREARMS ----
	// ---- COMPOUND VARIATIONS ----
	{
		name: 'Deficit Deadlift',
		equipment: ['Barbell', 'Weight Plates'],
		muscles: [
			{ muscle: 'Glutes', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Hamstrings', activation: 'primary', weighting: 0.8 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Quads', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Lats', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Traps', activation: 'secondary', weighting: 0.4 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'hip_hinge' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'mixed' as const,
		instructions: [
			'Stand on a 1-3 inch platform or plate',
			'Set up for conventional deadlift from the elevated surface',
			'The bar is now further from your hands at the start',
			'Pull with same mechanics as conventional deadlift',
			'Lock out at top, lower with control'
		],
		tips: [
			'Increases ROM and time under tension',
			'Builds off-the-floor strength for deadlifts',
			'Start with 1 inch deficit and progress',
			'Requires good hip mobility - do not round back'
		]
	},
	{
		name: 'Pause Squat',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Hamstrings', activation: 'secondary', weighting: 0.45 },
			{ muscle: 'Lower Back', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.35 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'overhand' as const,
		instructions: [
			'Set up for barbell back squat',
			'Descend to full depth',
			'Pause for 2-3 seconds at the bottom position',
			'Maintain bracing and upright posture during pause',
			'Drive up explosively from the paused position'
		],
		tips: [
			'Eliminates stretch reflex for pure concentric strength',
			'Builds strength and confidence in the hole',
			'Use 70-80% of normal squat weight',
			'Keep tension throughout - do not relax at bottom'
		]
	},
	{
		name: 'Zercher Squat',
		equipment: ['Barbell', 'Squat Rack'],
		muscles: [
			{ muscle: 'Quads', activation: 'primary', weighting: 0.95 },
			{ muscle: 'Glutes', activation: 'secondary', weighting: 0.7 },
			{ muscle: 'Abs', activation: 'secondary', weighting: 0.6 },
			{ muscle: 'Biceps', activation: 'secondary', weighting: 0.4 },
			{ muscle: 'Upper Back', activation: 'secondary', weighting: 0.45 }
		],
		difficulty: 'advanced' as const,
		movementPattern: 'squat' as const,
		plane: 'sagittal' as const,
		jointActions: ['hip_extension', 'knee_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'lengthened' as const,
		stabilityDemand: 'high' as const,
		unilateral: false,
		gripType: 'none' as const,
		instructions: [
			'Hold barbell in the crooks of elbows (elbow creases)',
			'Stand with feet slightly wider than shoulder width',
			'Squat down keeping bar close to body',
			'Elbows go between or inside knees at bottom',
			'Stand back up maintaining upright posture'
		],
		tips: [
			'Unique front-loaded position forces extreme core engagement',
			'Bar in elbow crease can be uncomfortable - use pad',
			'Great for lifters who cannot front squat due to wrist mobility',
			'Builds tremendous core and upper back strength'
		]
	},

	// ---- ARMS (more) ----
	{
		name: 'Drag Curl',
		equipment: ['Barbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.3 }
		],
		difficulty: 'intermediate' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion', 'shoulder_extension'],
		forceProfile: 'ascending' as const,
		stretchPosition: 'shortened' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'underhand' as const,
		instructions: [
			'Stand holding barbell at thighs',
			'Curl bar up while pulling elbows back behind body',
			'Bar drags up along the torso rather than arcing out',
			'Squeeze at top where bar is at chest level',
			'Reverse the motion back to start'
		],
		tips: [
			'Elbows moving back removes front delt involvement',
			'Focuses more on the short head of biceps',
			'Less weight than standard curl but better isolation',
			'Bar stays in contact with or near the body throughout'
		]
	},
	{
		name: 'Dumbbell Waiter Curl',
		equipment: ['Dumbbell'],
		muscles: [
			{ muscle: 'Biceps', activation: 'primary', weighting: 1.0 },
			{ muscle: 'Forearms', activation: 'secondary', weighting: 0.25 }
		],
		difficulty: 'beginner' as const,
		movementPattern: 'isolation' as const,
		plane: 'sagittal' as const,
		jointActions: ['elbow_flexion'],
		forceProfile: 'bell' as const,
		stretchPosition: 'mid' as const,
		stabilityDemand: 'medium' as const,
		unilateral: false,
		gripType: 'neutral' as const,
		instructions: [
			'Hold one dumbbell vertically by its top end like a waiter carrying a tray',
			'Both palms press against the underside of the top plate',
			'Curl the dumbbell up by flexing elbows',
			'Squeeze at top, lower with control'
		],
		tips: [
			'Supinated position throughout targets bicep short head',
			'Constant squeeze against plate trains isometric grip',
			'Good for pump work and mind-muscle connection',
			'Light weight is effective - focus on squeeze'
		]
	}
] as const;
