export const openApiSpec = {
	openapi: '3.1.0',
	info: {
		title: 'Logmaxing Training Science API',
		version: '1.0.0',
		description: `
The first public API for exercise science data. Access EMG-backed muscle activation data,
volume landmarks (MEV/MAV/MRV), and a comprehensive exercise database.

## Authentication
Currently in beta - no authentication required. API keys coming soon.

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
			description: 'Muscle groups with volume landmarks (MEV/MAV/MRV)'
		},
		{
			name: 'Exercises',
			description: 'Exercise database with EMG muscle activation data'
		},
		{
			name: 'Equipment',
			description: 'Gym equipment and accessories'
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
									items: { $ref: '#/components/schemas/MuscleWithVolume' }
								},
								example: [
									{
										id: 1,
										name: 'Chest',
										muscleGroup: 'Push',
										volumeThreshold: {
											muscleId: 1,
											mev: 10,
											mav: 16,
											mrv: 22,
											frequencyMin: 2,
											frequencyMax: 4,
											notes: 'Most respond well to 12-20 sets/week'
										}
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
							schema: { $ref: '#/components/schemas/MuscleWithVolumeInput' }
						}
					}
				},
				responses: {
					'200': {
						description: 'Muscle created successfully'
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
								schema: { $ref: '#/components/schemas/MuscleWithVolume' }
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
				description: 'Updates a muscle and its volume thresholds. Requires authentication.',
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
							schema: { $ref: '#/components/schemas/MuscleWithVolumeInput' }
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
				description: 'Deletes a muscle and its volume thresholds. Requires authentication.',
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
										primaryMuscle: 'Chest',
										muscleGroup: 'Push'
									},
									{
										id: 2,
										name: 'Incline Dumbbell Press',
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
									muscles: [
										{
											exerciseId: 1,
											muscleId: 1,
											activationType: 'primary',
											weighting: 0.95,
											muscle: { id: 1, name: 'Chest', muscleGroup: 'Push' }
										},
										{
											exerciseId: 1,
											muscleId: 4,
											activationType: 'secondary',
											weighting: 0.67,
											muscle: { id: 4, name: 'Triceps', muscleGroup: 'Push' }
										},
										{
											exerciseId: 1,
											muscleId: 2,
											activationType: 'secondary',
											weighting: 0.79,
											muscle: { id: 2, name: 'Front Delts', muscleGroup: 'Push' }
										}
									],
									equipment: [
										{
											exerciseId: 1,
											equipmentId: 1,
											equipment: { id: 1, name: 'Barbell' }
										},
										{
											exerciseId: 1,
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
		}
	},
	components: {
		schemas: {
			Muscle: {
				type: 'object',
				properties: {
					id: { type: 'integer', description: 'Unique muscle ID' },
					name: { type: 'string', description: 'Muscle name' },
					muscleGroup: {
						type: 'string',
						enum: ['Push', 'Pull', 'Legs', 'Core'],
						description: 'Category for workout splits'
					}
				},
				required: ['id', 'name', 'muscleGroup']
			},
			VolumeThreshold: {
				type: 'object',
				description: 'Volume landmarks based on Renaissance Periodization research',
				properties: {
					muscleId: { type: 'integer' },
					mev: {
						type: 'integer',
						description: 'Minimum Effective Volume - minimum sets/week to maintain muscle'
					},
					mav: {
						type: 'integer',
						description: 'Maximum Adaptive Volume - optimal sets/week for most people'
					},
					mrv: {
						type: 'integer',
						description: 'Maximum Recoverable Volume - sets/week ceiling before overtraining'
					},
					frequencyMin: {
						type: 'integer',
						description: 'Minimum recommended training frequency per week'
					},
					frequencyMax: {
						type: 'integer',
						description: 'Maximum recommended training frequency per week'
					},
					notes: { type: 'string', nullable: true }
				}
			},
			MuscleWithVolume: {
				allOf: [
					{ $ref: '#/components/schemas/Muscle' },
					{
						type: 'object',
						properties: {
							volumeThreshold: {
								$ref: '#/components/schemas/VolumeThreshold',
								nullable: true
							}
						}
					}
				]
			},
			MuscleWithVolumeInput: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					muscleGroup: { type: 'string', enum: ['Push', 'Pull', 'Legs', 'Core'] },
					volumeThreshold: {
						type: 'object',
						properties: {
							mev: { type: 'integer' },
							mav: { type: 'integer' },
							mrv: { type: 'integer' },
							frequencyMin: { type: 'integer' },
							frequencyMax: { type: 'integer' },
							notes: { type: 'string', nullable: true }
						}
					}
				},
				required: ['name', 'muscleGroup']
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
				description: 'Exercise summary for list views',
				properties: {
					id: { type: 'integer' },
					name: { type: 'string' },
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
					exerciseId: { type: 'integer' },
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
						description: 'EMG-based activation percentage (0.0-1.0)'
					},
					muscle: { $ref: '#/components/schemas/Muscle' }
				}
			},
			ExerciseEquipment: {
				type: 'object',
				properties: {
					exerciseId: { type: 'integer' },
					equipmentId: { type: 'integer' },
					equipment: { $ref: '#/components/schemas/Equipment' }
				}
			},
			ExerciseWithDetails: {
				type: 'object',
				description: 'Full exercise details with muscle activations and equipment',
				properties: {
					id: { type: 'integer' },
					name: { type: 'string' },
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
			}
		}
	}
} as const;
