export const openApiSpec = {
	openapi: '3.1.0',
	info: {
		title: 'Logmaxing Training Science API',
		version: '1.0.0',
		description: `
The first public API for exercise science data. Access EMG-backed muscle activation data,
volume landmarks (MEV/MAV/MRV), and a comprehensive exercise database.

## Authentication
All endpoints require an API key passed via the \`X-API-Key\` header.

\`\`\`bash
curl -H "X-API-Key: lmx_your_key_here" https://logmaxing.tech/api/muscles
\`\`\`

## Rate Limits
- **Free tier**: 100 requests/day
- **Developer**: 5,000 requests/month ($29/mo)
- **Pro**: 25,000 requests/month ($99/mo)
- **Enterprise**: 100,000 requests/month ($299/mo)

## Base URL
\`https://logmaxing.tech/api\`
		`.trim(),
		contact: {
			name: 'Logmaxing Support',
			url: 'https://logmaxing.tech'
		},
		license: {
			name: 'Proprietary',
			url: 'https://logmaxing.tech/terms'
		}
	},
	servers: [
		{
			url: '/api',
			description: 'Current server'
		}
	],
	tags: [
		{
			name: 'Muscles',
			description: 'Muscle groups with volume landmarks (MEV/MAV/MRV) and recovery data'
		},
		{
			name: 'Exercises',
			description:
				'Exercise database with EMG muscle activation data, biomechanics classification, and form guidance'
		},
		{
			name: 'Equipment',
			description: 'Gym equipment and accessories'
		},
		{
			name: 'Volume',
			description:
				'Training volume calculator - compute effective sets per muscle and check if you are under, optimal, or over volume thresholds'
		}
	],
	paths: {
		'/muscles': {
			get: {
				tags: ['Muscles'],
				summary: 'List all muscles',
				description:
					'Returns all muscle groups with their volume landmarks (MEV, MAV, MRV) based on Renaissance Periodization research.',
				operationId: 'getMuscles',
				responses: {
					'200': {
						description: 'List of muscles with volume thresholds',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: { $ref: '#/components/schemas/Muscle' }
								},
								example: [
									{
										id: 1,
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
										trainingTips:
											'Responds well to stretch-focused movements like flyes. Full ROM important.'
									}
								]
							}
						}
					}
				}
			},
			post: {
				tags: ['Muscles'],
				summary: 'Create a muscle',
				description: 'Creates a new muscle with volume thresholds. Requires authentication.',
				operationId: 'createMuscle',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/MuscleInput' }
						}
					}
				},
				responses: {
					'201': {
						description: 'Muscle created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Muscle' }
							}
						}
					},
					'401': {
						description: 'Unauthorized'
					}
				}
			}
		},
		'/muscles/{id}': {
			get: {
				tags: ['Muscles'],
				summary: 'Get a muscle by ID',
				description: 'Returns a single muscle with its volume landmarks.',
				operationId: 'getMuscle',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer' },
						description: 'Muscle ID'
					}
				],
				responses: {
					'200': {
						description: 'Muscle details',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Muscle' }
							}
						}
					},
					'404': {
						description: 'Muscle not found'
					}
				}
			},
			put: {
				tags: ['Muscles'],
				summary: 'Update a muscle',
				description: 'Updates a muscle. Requires authentication.',
				operationId: 'updateMuscle',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer' },
						description: 'Muscle ID'
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/MuscleInput' }
						}
					}
				},
				responses: {
					'200': {
						description: 'Muscle updated successfully'
					},
					'401': {
						description: 'Unauthorized'
					},
					'404': {
						description: 'Muscle not found'
					}
				}
			},
			delete: {
				tags: ['Muscles'],
				summary: 'Delete a muscle',
				description: 'Deletes a muscle. Requires authentication.',
				operationId: 'deleteMuscle',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer' },
						description: 'Muscle ID'
					}
				],
				responses: {
					'200': {
						description: 'Muscle deleted successfully'
					},
					'401': {
						description: 'Unauthorized'
					},
					'404': {
						description: 'Muscle not found'
					}
				}
			}
		},
		'/exercises': {
			get: {
				tags: ['Exercises'],
				summary: 'List exercises',
				description:
					'Returns exercises with optional filtering by name, muscle, muscle group, or equipment. Includes primary muscle activation for each exercise.',
				operationId: 'getExercises',
				parameters: [
					{
						name: 'search',
						in: 'query',
						schema: { type: 'string' },
						description: 'Search exercises by name (case-insensitive)',
						example: 'bench press'
					},
					{
						name: 'muscleId',
						in: 'query',
						schema: { type: 'integer' },
						description: 'Filter by muscle ID'
					},
					{
						name: 'muscleGroup',
						in: 'query',
						schema: {
							type: 'string',
							enum: ['Push', 'Pull', 'Legs', 'Core']
						},
						description: 'Filter by muscle group category'
					},
					{
						name: 'equipmentId',
						in: 'query',
						schema: { type: 'integer' },
						description: 'Filter by equipment ID'
					},
					{
						name: 'difficulty',
						in: 'query',
						schema: {
							type: 'string',
							enum: ['beginner', 'intermediate', 'advanced']
						},
						description: 'Filter by exercise difficulty level'
					},
					{
						name: 'movementPattern',
						in: 'query',
						schema: {
							type: 'string',
							enum: [
								'horizontal_push',
								'vertical_push',
								'horizontal_pull',
								'vertical_pull',
								'hip_hinge',
								'squat',
								'lunge',
								'isolation',
								'carry',
								'rotation'
							]
						},
						description: 'Filter by movement pattern classification'
					},
					{
						name: 'forceProfile',
						in: 'query',
						schema: {
							type: 'string',
							enum: ['ascending', 'descending', 'bell', 'constant']
						},
						description: 'Filter by force curve - where in the ROM is the exercise hardest'
					},
					{
						name: 'stretchPosition',
						in: 'query',
						schema: {
							type: 'string',
							enum: ['lengthened', 'mid', 'shortened']
						},
						description:
							'Filter by where the muscle is loaded - critical for hypertrophy (lengthened = more growth stimulus)'
					},
					{
						name: 'unilateral',
						in: 'query',
						schema: { type: 'boolean' },
						description: 'Filter for single-limb exercises (true) or bilateral (false)'
					},
					{
						name: 'gripType',
						in: 'query',
						schema: {
							type: 'string',
							enum: ['overhand', 'underhand', 'neutral', 'mixed', 'none']
						},
						description: 'Filter by grip orientation'
					},
					{
						name: 'limit',
						in: 'query',
						schema: { type: 'integer', default: 50, maximum: 100 },
						description: 'Maximum number of results (default: 50, max: 100)'
					},
					{
						name: 'offset',
						in: 'query',
						schema: { type: 'integer', default: 0 },
						description: 'Number of results to skip for pagination'
					}
				],
				responses: {
					'200': {
						description: 'List of exercises',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: { $ref: '#/components/schemas/ExerciseListItem' }
								},
								example: [
									{
										id: 1,
										name: 'Barbell Bench Press',
										difficulty: 'intermediate',
										movementPattern: 'horizontal_push',
										forceProfile: 'ascending',
										stretchPosition: 'lengthened',
										primaryMuscle: 'Chest',
										muscleGroup: 'Push'
									},
									{
										id: 2,
										name: 'Incline Dumbbell Press',
										difficulty: 'intermediate',
										movementPattern: 'horizontal_push',
										forceProfile: 'ascending',
										stretchPosition: 'lengthened',
										primaryMuscle: 'Chest',
										muscleGroup: 'Push'
									}
								]
							}
						}
					}
				}
			}
		},
		'/exercises/{id}': {
			get: {
				tags: ['Exercises'],
				summary: 'Get exercise details',
				description:
					'Returns detailed exercise information including all muscle activations (with EMG-based weightings) and compatible equipment.',
				operationId: 'getExercise',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer' },
						description: 'Exercise ID'
					}
				],
				responses: {
					'200': {
						description: 'Exercise with full muscle activation and equipment details',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ExerciseWithDetails' },
								example: {
									id: 1,
									name: 'Barbell Bench Press',
									difficulty: 'intermediate',
									movementPattern: 'horizontal_push',
									plane: 'sagittal',
									jointActions: ['shoulder_flexion', 'elbow_extension'],
									forceProfile: 'ascending',
									stretchPosition: 'lengthened',
									stabilityDemand: 'high',
									unilateral: false,
									gripType: 'overhand',
									instructions: [
										'Lie on flat bench with eyes under bar',
										'Grip bar slightly wider than shoulder width',
										'Unrack and lower to mid-chest',
										'Press up until arms are extended'
									],
									tips: [
										'Keep shoulder blades retracted throughout',
										'Maintain arch in lower back',
										'Control the descent for 2-3 seconds'
									],
									muscles: [
										{
											muscleId: 1,
											activationType: 'primary',
											weighting: 0.95,
											muscle: { id: 1, name: 'Chest', muscleGroup: 'Push' }
										},
										{
											muscleId: 4,
											activationType: 'secondary',
											weighting: 0.67,
											muscle: { id: 4, name: 'Triceps', muscleGroup: 'Push' }
										},
										{
											muscleId: 2,
											activationType: 'secondary',
											weighting: 0.79,
											muscle: { id: 2, name: 'Front Delts', muscleGroup: 'Push' }
										}
									],
									equipment: [
										{
											equipmentId: 1,
											equipment: { id: 1, name: 'Barbell' }
										},
										{
											equipmentId: 2,
											equipment: { id: 2, name: 'Flat Bench' }
										}
									]
								}
							}
						}
					},
					'404': {
						description: 'Exercise not found'
					}
				}
			}
		},
		'/equipment': {
			get: {
				tags: ['Equipment'],
				summary: 'List all equipment',
				description: 'Returns all gym equipment and accessories in the database.',
				operationId: 'getEquipment',
				responses: {
					'200': {
						description: 'List of equipment',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: { $ref: '#/components/schemas/Equipment' }
								},
								example: [
									{ id: 1, name: 'Barbell' },
									{ id: 2, name: 'Dumbbells' },
									{ id: 3, name: 'Cable Machine' }
								]
							}
						}
					}
				}
			}
		},
		'/volume': {
			get: {
				tags: ['Volume'],
				summary: 'Get volume thresholds',
				description:
					'Returns all muscle volume thresholds (MEV/MAV/MRV) for reference. Use POST to calculate effective volume.',
				operationId: 'getVolumeThresholds',
				responses: {
					'200': {
						description: 'Volume thresholds for all muscles',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/VolumeThresholdsResponse' }
							}
						}
					}
				}
			},
			post: {
				tags: ['Volume'],
				summary: 'Calculate training volume',
				description: `
**The core differentiator of this API.** Calculate effective training volume per muscle and see if you're under, optimal, or over volume thresholds.

Two input modes:
- **Exercise-based**: Pass exercise IDs + sets, uses EMG-weighted activations
- **Direct**: Pass muscle IDs + sets directly

The response tells you exactly which muscles are undertrained, optimal, or overtrained based on Renaissance Periodization science.
				`.trim(),
				operationId: 'calculateVolume',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/VolumeInput' },
							examples: {
								exerciseBased: {
									summary: 'Exercise-based input',
									description:
										'Calculate volume from exercises - automatically applies EMG weightings',
									value: {
										exercises: [
											{ exerciseId: 1, sets: 4 },
											{ exerciseId: 12, sets: 3 },
											{ exerciseId: 25, sets: 3 }
										]
									}
								},
								directMuscle: {
									summary: 'Direct muscle input',
									description: 'Specify sets per muscle directly',
									value: {
										directVolume: [
											{ muscleId: 1, sets: 12 },
											{ muscleId: 3, sets: 8 }
										]
									}
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Volume analysis with zone classification',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/VolumeResponse' },
								example: {
									muscles: [
										{
											muscleId: 1,
											muscleName: 'Chest',
											effectiveSets: 10,
											zone: 'optimal',
											thresholds: { mev: 10, mavMin: 12, mavMax: 18, mrv: 22 }
										},
										{
											muscleId: 4,
											muscleName: 'Triceps',
											effectiveSets: 6,
											zone: 'under',
											thresholds: { mev: 8, mavMin: 10, mavMax: 14, mrv: 18 }
										}
									],
									summary: {
										totalMuscles: 2,
										under: ['Triceps'],
										optimal: ['Chest'],
										over: []
									}
								}
							}
						}
					},
					'400': {
						description: 'Invalid input - must provide exercises or directVolume'
					}
				}
			}
		}
	},
	components: {
		schemas: {
			Muscle: {
				type: 'object',
				description: 'Muscle with volume landmarks based on Renaissance Periodization research',
				properties: {
					id: { type: 'integer', description: 'Unique muscle ID' },
					name: { type: 'string', description: 'Muscle name' },
					muscleGroup: {
						type: 'string',
						enum: ['Push', 'Pull', 'Legs', 'Core', 'Other'],
						description: 'Category for workout splits'
					},
					mv: {
						type: 'integer',
						nullable: true,
						description: 'Maintenance Volume - minimum sets/week to maintain muscle'
					},
					mev: {
						type: 'integer',
						nullable: true,
						description: 'Minimum Effective Volume - sets/week to start growing'
					},
					mavMin: {
						type: 'integer',
						nullable: true,
						description: 'Maximum Adaptive Volume (minimum) - optimal sets/week range start'
					},
					mavMax: {
						type: 'integer',
						nullable: true,
						description: 'Maximum Adaptive Volume (maximum) - optimal sets/week range end'
					},
					mrv: {
						type: 'integer',
						nullable: true,
						description: 'Maximum Recoverable Volume - sets/week ceiling before overtraining'
					},
					recoveryDays: {
						type: 'integer',
						nullable: true,
						description: 'Typical recovery time in days (1-3)'
					},
					frequencyMin: {
						type: 'integer',
						nullable: true,
						description: 'Minimum recommended training frequency (sessions/week)'
					},
					frequencyMax: {
						type: 'integer',
						nullable: true,
						description: 'Maximum recommended training frequency (sessions/week)'
					},
					trainingTips: {
						type: 'string',
						nullable: true,
						description: 'Muscle-specific training guidance and form cues'
					}
				},
				required: ['id', 'name']
			},
			MuscleInput: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					muscleGroup: { type: 'string', enum: ['Push', 'Pull', 'Legs', 'Core', 'Other'] },
					mv: { type: 'integer', nullable: true },
					mev: { type: 'integer', nullable: true },
					mavMin: { type: 'integer', nullable: true },
					mavMax: { type: 'integer', nullable: true },
					mrv: { type: 'integer', nullable: true }
				},
				required: ['name']
			},
			Equipment: {
				type: 'object',
				properties: {
					id: { type: 'integer' },
					name: { type: 'string' }
				},
				required: ['id', 'name']
			},
			ExerciseListItem: {
				type: 'object',
				description: 'Exercise summary for list views with biomechanics classification',
				properties: {
					id: { type: 'integer' },
					name: { type: 'string' },
					difficulty: {
						type: 'string',
						enum: ['beginner', 'intermediate', 'advanced'],
						nullable: true,
						description: 'Exercise difficulty level'
					},
					movementPattern: {
						type: 'string',
						enum: [
							'horizontal_push',
							'vertical_push',
							'horizontal_pull',
							'vertical_pull',
							'hip_hinge',
							'squat',
							'lunge',
							'isolation',
							'carry',
							'rotation'
						],
						nullable: true,
						description: 'Movement pattern classification'
					},
					forceProfile: {
						type: 'string',
						enum: ['ascending', 'descending', 'bell', 'constant'],
						nullable: true,
						description: 'Where in ROM the exercise is hardest'
					},
					stretchPosition: {
						type: 'string',
						enum: ['lengthened', 'mid', 'shortened'],
						nullable: true,
						description: 'Where muscle is loaded - critical for hypertrophy'
					},
					primaryMuscle: { type: 'string', nullable: true },
					muscleGroup: {
						type: 'string',
						enum: ['Push', 'Pull', 'Legs', 'Core'],
						nullable: true
					}
				},
				required: ['id', 'name']
			},
			MuscleActivation: {
				type: 'object',
				description: 'How much an exercise activates a specific muscle',
				properties: {
					muscleId: { type: 'integer' },
					activationType: {
						type: 'string',
						enum: ['primary', 'secondary'],
						description: 'Whether this is a primary or secondary mover'
					},
					weighting: {
						type: 'number',
						format: 'float',
						minimum: 0,
						maximum: 1,
						description:
							'EMG-based activation percentage (0.0-1.0). 1.0 = full activation, used in volume calculations.'
					},
					muscle: {
						type: 'object',
						properties: {
							id: { type: 'integer' },
							name: { type: 'string' },
							muscleGroup: { type: 'string' }
						},
						description: 'Basic muscle info'
					}
				}
			},
			ExerciseEquipment: {
				type: 'object',
				properties: {
					equipmentId: { type: 'integer' },
					equipment: { $ref: '#/components/schemas/Equipment' }
				}
			},
			ExerciseWithDetails: {
				type: 'object',
				description:
					'Full exercise details with biomechanics, muscle activations, equipment, and form guidance',
				properties: {
					id: { type: 'integer' },
					name: { type: 'string' },
					difficulty: {
						type: 'string',
						enum: ['beginner', 'intermediate', 'advanced'],
						nullable: true
					},
					movementPattern: {
						type: 'string',
						enum: [
							'horizontal_push',
							'vertical_push',
							'horizontal_pull',
							'vertical_pull',
							'hip_hinge',
							'squat',
							'lunge',
							'isolation',
							'carry',
							'rotation'
						],
						nullable: true,
						description: 'Movement pattern classification for programming balance'
					},
					plane: {
						type: 'string',
						enum: ['sagittal', 'frontal', 'transverse', 'multi'],
						nullable: true,
						description: 'Primary plane of motion'
					},
					jointActions: {
						type: 'array',
						items: { type: 'string' },
						nullable: true,
						description: 'Joint actions involved (e.g., shoulder_flexion, elbow_extension)'
					},
					forceProfile: {
						type: 'string',
						enum: ['ascending', 'descending', 'bell', 'constant'],
						nullable: true,
						description:
							'Where in ROM the exercise is hardest - ascending = top, descending = bottom, bell = middle'
					},
					stretchPosition: {
						type: 'string',
						enum: ['lengthened', 'mid', 'shortened'],
						nullable: true,
						description: 'Where muscle is loaded - lengthened position = more hypertrophy stimulus'
					},
					stabilityDemand: {
						type: 'string',
						enum: ['high', 'medium', 'low'],
						nullable: true,
						description: 'How much stabilization is required'
					},
					unilateral: {
						type: 'boolean',
						nullable: true,
						description: 'Whether exercise is single-limb'
					},
					gripType: {
						type: 'string',
						enum: ['overhand', 'underhand', 'neutral', 'mixed', 'none'],
						nullable: true,
						description: 'Grip orientation'
					},
					instructions: {
						type: 'array',
						items: { type: 'string' },
						nullable: true,
						description: 'Step-by-step execution guide'
					},
					tips: {
						type: 'array',
						items: { type: 'string' },
						nullable: true,
						description: 'Form cues and coaching points'
					},
					muscles: {
						type: 'array',
						items: { $ref: '#/components/schemas/MuscleActivation' },
						description: 'All muscle activations with EMG weightings'
					},
					equipment: {
						type: 'array',
						items: { $ref: '#/components/schemas/ExerciseEquipment' },
						description: 'Compatible equipment'
					}
				},
				required: ['id', 'name', 'muscles', 'equipment']
			},
			VolumeInput: {
				type: 'object',
				description: 'Input for volume calculation - use either exercises or directVolume',
				properties: {
					exercises: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								exerciseId: { type: 'integer', description: 'Exercise ID' },
								sets: { type: 'integer', description: 'Number of sets performed' }
							},
							required: ['exerciseId', 'sets']
						},
						description: 'List of exercises with sets - EMG weightings applied automatically'
					},
					directVolume: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								muscleId: { type: 'integer', description: 'Muscle ID' },
								sets: { type: 'integer', description: 'Direct sets for this muscle' }
							},
							required: ['muscleId', 'sets']
						},
						description: 'Direct muscle volume input - bypasses exercise lookup'
					}
				}
			},
			VolumeThresholdsResponse: {
				type: 'object',
				description: 'Reference thresholds for all muscles',
				properties: {
					muscles: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								muscleId: { type: 'integer' },
								muscleName: { type: 'string' },
								thresholds: {
									type: 'object',
									properties: {
										mev: { type: 'integer', description: 'Minimum Effective Volume' },
										mavMin: {
											type: 'integer',
											description: 'Maximum Adaptive Volume (min)'
										},
										mavMax: {
											type: 'integer',
											description: 'Maximum Adaptive Volume (max)'
										},
										mrv: { type: 'integer', description: 'Maximum Recoverable Volume' }
									}
								}
							}
						}
					}
				}
			},
			VolumeResponse: {
				type: 'object',
				description: 'Volume analysis result with zone classifications',
				properties: {
					muscles: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								muscleId: { type: 'integer' },
								muscleName: { type: 'string' },
								effectiveSets: {
									type: 'number',
									description: 'Calculated effective sets (may be weighted)'
								},
								zone: {
									type: 'string',
									enum: ['under', 'optimal', 'over'],
									description: 'Volume zone - under MEV, between MEV-MRV (optimal), or over MRV'
								},
								thresholds: {
									type: 'object',
									properties: {
										mev: { type: 'integer' },
										mavMin: { type: 'integer' },
										mavMax: { type: 'integer' },
										mrv: { type: 'integer' }
									}
								}
							}
						}
					},
					summary: {
						type: 'object',
						properties: {
							totalMuscles: { type: 'integer' },
							under: {
								type: 'array',
								items: { type: 'string' },
								description: 'Muscle names below MEV'
							},
							optimal: {
								type: 'array',
								items: { type: 'string' },
								description: 'Muscle names in optimal range'
							},
							over: {
								type: 'array',
								items: { type: 'string' },
								description: 'Muscle names above MRV'
							}
						}
					}
				}
			}
		},
		securitySchemes: {
			ApiKeyAuth: {
				type: 'apiKey',
				in: 'header',
				name: 'X-API-Key',
				description: 'API key for authentication. Format: lmx_...'
			}
		}
	},
	security: [{ ApiKeyAuth: [] }]
} as const;
