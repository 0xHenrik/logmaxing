export const openApiSpec = {
	openapi: '3.1.0',
	info: {
		title: 'Logmaxing Training Science API',
		version: '1.1.0',
		description: `
The first public API for exercise science data. Access EMG-backed muscle activation data,
volume landmarks (MEV/MAV/MRV), and a comprehensive exercise database.

## Authentication
All endpoints require an API key passed via the \`X-API-Key\` header (except \`/waitlist\` and \`/openapi.json\`).

\`\`\`bash
curl -H "X-API-Key: lmx_your_key_here" https://api.logmaxing.tech/muscles
\`\`\`

## Rate Limits
| Tier | Rate | Price |
|------|------|-------|
| Free | 100 requests/day | $0 |
| Developer | ~5,000/month (170/day) | $29/mo |
| Pro | ~25,000/month (850/day) | $99/mo |
| Enterprise | ~100,000/month (3,400/day) | $299/mo |

Rate limit headers are returned on every response:
- \`X-RateLimit-Limit\` — Max requests for your tier
- \`X-RateLimit-Remaining\` — Requests remaining
- \`X-RateLimit-Reset\` — Unix timestamp when the window resets

## Base URL
\`https://api.logmaxing.tech\` or \`https://logmaxing.tech/api\`
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
			url: 'https://api.logmaxing.tech',
			description: 'Production (subdomain)'
		},
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
				'Training volume calculator — compute effective sets per muscle and check if you are under, optimal, or over volume thresholds'
		},
		{
			name: 'API Keys',
			description: 'Manage your API keys — create, list, revoke, and delete'
		},
		{
			name: 'Waitlist',
			description: 'Join the waitlist (no authentication required)'
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
					},
					'401': { $ref: '#/components/responses/Unauthorized' },
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			},
			post: {
				tags: ['Muscles'],
				summary: 'Create a muscle',
				description:
					'Creates a new muscle with volume thresholds. **Requires enterprise tier API key.**',
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
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'403': { $ref: '#/components/responses/Forbidden' },
					'415': { $ref: '#/components/responses/UnsupportedMediaType' },
					'429': { $ref: '#/components/responses/RateLimited' }
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
						schema: { type: 'integer', minimum: 1 },
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
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'404': {
						description: 'Muscle not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' },
								example: { error: 'Not found' }
							}
						}
					},
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			},
			put: {
				tags: ['Muscles'],
				summary: 'Update a muscle',
				description:
					'Partially updates a muscle. All fields are optional. **Requires enterprise tier API key.**',
				operationId: 'updateMuscle',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer', minimum: 1 },
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
						description: 'Muscle updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Message' },
								example: { message: 'Updated' }
							}
						}
					},
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'403': { $ref: '#/components/responses/Forbidden' },
					'415': { $ref: '#/components/responses/UnsupportedMediaType' },
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			},
			delete: {
				tags: ['Muscles'],
				summary: 'Delete a muscle',
				description: 'Permanently deletes a muscle. **Requires enterprise tier API key.**',
				operationId: 'deleteMuscle',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer', minimum: 1 },
						description: 'Muscle ID'
					}
				],
				responses: {
					'200': {
						description: 'Muscle deleted successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
										id: { type: 'integer' }
									}
								},
								example: { message: 'Deleted', id: 1 }
							}
						}
					},
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'403': { $ref: '#/components/responses/Forbidden' },
					'404': {
						description: 'Muscle not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' },
								example: { error: 'Not found' }
							}
						}
					},
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			}
		},
		'/exercises': {
			get: {
				tags: ['Exercises'],
				summary: 'List exercises',
				description:
					'Returns exercises with optional filtering by name, muscle, muscle group, equipment, or biomechanics. Includes primary muscle activation for each exercise.',
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
						schema: { type: 'integer', minimum: 1 },
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
						schema: { type: 'integer', minimum: 1 },
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
						description: 'Filter by force curve — where in the ROM is the exercise hardest'
					},
					{
						name: 'stretchPosition',
						in: 'query',
						schema: {
							type: 'string',
							enum: ['lengthened', 'mid', 'shortened']
						},
						description:
							'Filter by where the muscle is loaded — critical for hypertrophy (lengthened = more growth stimulus)'
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
						schema: { type: 'integer', default: 50, minimum: 1, maximum: 100 },
						description: 'Maximum number of results (default: 50, max: 100)'
					},
					{
						name: 'offset',
						in: 'query',
						schema: { type: 'integer', default: 0, minimum: 0 },
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
					},
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			}
		},
		'/exercises/{id}': {
			get: {
				tags: ['Exercises'],
				summary: 'Get exercise details',
				description:
					'Returns detailed exercise information including all muscle activations (with EMG-based weightings), biomechanics classification, and compatible equipment.',
				operationId: 'getExercise',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer', minimum: 1 },
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
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'404': {
						description: 'Exercise not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' },
								example: { error: 'Not found' }
							}
						}
					},
					'429': { $ref: '#/components/responses/RateLimited' }
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
					},
					'401': { $ref: '#/components/responses/Unauthorized' },
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			}
		},
		'/volume': {
			get: {
				tags: ['Volume'],
				summary: 'Get volume thresholds',
				description:
					'Returns all muscle volume thresholds (MEV/MAV/MRV) and sample exercises for reference. Use POST to calculate effective volume.',
				operationId: 'getVolumeThresholds',
				responses: {
					'200': {
						description: 'Volume thresholds for all muscles with sample exercises',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/VolumeThresholdsResponse' }
							}
						}
					},
					'401': { $ref: '#/components/responses/Unauthorized' },
					'429': { $ref: '#/components/responses/RateLimited' }
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

You can combine both in a single request. The response tells you exactly which muscles are undertrained, optimal, or overtrained based on Renaissance Periodization science.
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
										'Calculate volume from exercises — automatically applies EMG weightings',
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
								},
								combined: {
									summary: 'Combined input',
									description: 'Use both exercise-based and direct input together',
									value: {
										exercises: [{ exerciseId: 1, sets: 4 }],
										directVolume: [{ muscleId: 3, sets: 6 }]
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
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'415': { $ref: '#/components/responses/UnsupportedMediaType' },
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			}
		},
		'/keys': {
			get: {
				tags: ['API Keys'],
				summary: 'List your API keys',
				description:
					'Returns all API keys belonging to the authenticated user. Key hashes are never exposed — only the prefix is shown.',
				operationId: 'listApiKeys',
				responses: {
					'200': {
						description: 'List of API keys',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: { $ref: '#/components/schemas/ApiKey' }
								},
								example: [
									{
										id: 1,
										keyPrefix: 'lmx_abc123def456',
										name: 'My App',
										tier: 'free',
										isActive: true,
										usageCount: 42,
										lastUsedAt: '2026-02-07T10:30:00Z',
										createdAt: '2026-01-15T08:00:00Z',
										expiresAt: null,
										revokedAt: null
									}
								]
							}
						}
					},
					'401': { $ref: '#/components/responses/Unauthorized' },
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			},
			post: {
				tags: ['API Keys'],
				summary: 'Create a new API key',
				description: `
Creates a new API key. The raw key is returned **only once** in the response — store it securely.

Per-tier key limits:
| Tier | Max active keys |
|------|----------------|
| Free | 5 |
| Developer | 10 |
| Pro | 25 |
| Enterprise | 100 |
				`.trim(),
				operationId: 'createApiKey',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateApiKeyInput' },
							example: {
								name: 'My Mobile App',
								expiresAt: '2027-01-01T00:00:00Z'
							}
						}
					}
				},
				responses: {
					'201': {
						description:
							'API key created. The `rawKey` field contains the full key — **save it now, it will not be shown again.**',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ApiKeyCreated' },
								example: {
									key: {
										id: 2,
										keyPrefix: 'lmx_xyz789abc012',
										name: 'My Mobile App',
										tier: 'free',
										isActive: true,
										createdAt: '2026-02-07T12:00:00Z'
									},
									rawKey: 'lmx_xYz789AbC012...',
									warning: 'Store this key securely. It will not be shown again.'
								}
							}
						}
					},
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'403': {
						description: 'Key limit reached for your tier',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' },
								example: {
									error: 'Key limit reached',
									message: 'Maximum of 5 active keys for your free tier.'
								}
							}
						}
					},
					'415': { $ref: '#/components/responses/UnsupportedMediaType' },
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			}
		},
		'/keys/{id}': {
			get: {
				tags: ['API Keys'],
				summary: 'Get API key details',
				description:
					'Returns details for a single API key. Only returns keys owned by the authenticated user.',
				operationId: 'getApiKey',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer', minimum: 1 },
						description: 'API key ID'
					}
				],
				responses: {
					'200': {
						description: 'API key details',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ApiKey' }
							}
						}
					},
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'404': {
						description: 'Key not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' },
								example: { error: 'Key not found' }
							}
						}
					},
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			},
			delete: {
				tags: ['API Keys'],
				summary: 'Delete an API key',
				description:
					'Permanently deletes an API key. This action is irreversible. For a soft delete that preserves audit trail, use the revoke endpoint instead.',
				operationId: 'deleteApiKey',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer', minimum: 1 },
						description: 'API key ID'
					}
				],
				responses: {
					'204': {
						description: 'Key deleted successfully (no content)'
					},
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'404': {
						description: 'Key not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' },
								example: { error: 'Key not found' }
							}
						}
					},
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			}
		},
		'/keys/{id}/revoke': {
			post: {
				tags: ['API Keys'],
				summary: 'Revoke an API key',
				description:
					'Soft-deletes an API key by marking it as revoked. The key remains in the database for audit purposes but can no longer authenticate requests.',
				operationId: 'revokeApiKey',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer', minimum: 1 },
						description: 'API key ID'
					}
				],
				responses: {
					'200': {
						description: 'Key revoked successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Message' },
								example: { message: 'Key revoked successfully' }
							}
						}
					},
					'400': { $ref: '#/components/responses/ValidationError' },
					'401': { $ref: '#/components/responses/Unauthorized' },
					'404': {
						description: 'Key not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' },
								example: { error: 'Key not found' }
							}
						}
					},
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			}
		},
		'/waitlist': {
			post: {
				tags: ['Waitlist'],
				summary: 'Join the waitlist',
				description:
					'Add an email to the waitlist. **No API key required.** Rate limited to 10 requests/day per IP address. Returns a uniform response regardless of whether the email is new or already exists (to prevent enumeration).',
				operationId: 'joinWaitlist',
				security: [],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/WaitlistInput' },
							example: { email: 'user@example.com' }
						}
					}
				},
				responses: {
					'200': {
						description: 'Request accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Message' },
								example: { message: "Thanks! If this email is new, you're on the list." }
							}
						}
					},
					'400': { $ref: '#/components/responses/ValidationError' },
					'415': { $ref: '#/components/responses/UnsupportedMediaType' },
					'429': { $ref: '#/components/responses/RateLimited' }
				}
			}
		}
	},
	components: {
		schemas: {
			Error: {
				type: 'object',
				properties: {
					error: { type: 'string', description: 'Error type or short message' },
					message: { type: 'string', description: 'Detailed error message (optional)' }
				},
				required: ['error']
			},
			Message: {
				type: 'object',
				properties: {
					message: { type: 'string' }
				},
				required: ['message']
			},
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
						description: 'Maintenance Volume — minimum sets/week to maintain muscle'
					},
					mev: {
						type: 'integer',
						nullable: true,
						description: 'Minimum Effective Volume — sets/week to start growing'
					},
					mavMin: {
						type: 'integer',
						nullable: true,
						description: 'Maximum Adaptive Volume (minimum) — optimal sets/week range start'
					},
					mavMax: {
						type: 'integer',
						nullable: true,
						description: 'Maximum Adaptive Volume (maximum) — optimal sets/week range end'
					},
					mrv: {
						type: 'integer',
						nullable: true,
						description: 'Maximum Recoverable Volume — sets/week ceiling before overtraining'
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
					mrv: { type: 'integer', nullable: true },
					recoveryDays: { type: 'integer', nullable: true },
					frequencyMin: { type: 'integer', nullable: true },
					frequencyMax: { type: 'integer', nullable: true },
					trainingTips: { type: 'string', nullable: true }
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
						description: 'Where muscle is loaded — critical for hypertrophy'
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
							'Where in ROM the exercise is hardest — ascending = top, descending = bottom, bell = middle'
					},
					stretchPosition: {
						type: 'string',
						enum: ['lengthened', 'mid', 'shortened'],
						nullable: true,
						description: 'Where muscle is loaded — lengthened position = more hypertrophy stimulus'
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
				description:
					'Input for volume calculation. Provide exercises, directVolume, or both. At least one must be non-empty.',
				properties: {
					exercises: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								exerciseId: { type: 'integer', minimum: 1, description: 'Exercise ID' },
								sets: {
									type: 'integer',
									minimum: 1,
									maximum: 50,
									description: 'Number of sets performed'
								}
							},
							required: ['exerciseId', 'sets']
						},
						maxItems: 50,
						description: 'List of exercises with sets — EMG weightings applied automatically'
					},
					directVolume: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								muscleId: { type: 'integer', minimum: 1, description: 'Muscle ID' },
								sets: {
									type: 'integer',
									minimum: 1,
									maximum: 100,
									description: 'Direct sets for this muscle'
								}
							},
							required: ['muscleId', 'sets']
						},
						maxItems: 25,
						description: 'Direct muscle volume input — bypasses exercise lookup'
					}
				}
			},
			VolumeThresholdsResponse: {
				type: 'object',
				description: 'Reference thresholds and sample exercises for building requests',
				properties: {
					muscles: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'integer' },
								name: { type: 'string' },
								mev: { type: 'integer', description: 'Minimum Effective Volume' },
								mrv: { type: 'integer', description: 'Maximum Recoverable Volume' }
							}
						}
					},
					sampleExercises: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'integer' },
								name: { type: 'string' },
								muscles: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											muscleId: { type: 'integer' },
											weighting: { type: 'number', nullable: true }
										}
									}
								}
							}
						}
					},
					hint: { type: 'string' }
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
									description: 'Calculated effective sets (EMG-weighted when from exercises)'
								},
								zone: {
									type: 'string',
									enum: ['under', 'optimal', 'over'],
									description: 'Volume zone — under MEV, between MEV-MRV (optimal), or over MRV'
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
					warnings: {
						type: 'array',
						items: { type: 'string' },
						description: 'Warnings about unknown muscle IDs or other issues'
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
			},
			ApiKey: {
				type: 'object',
				description: 'API key metadata (the actual key hash is never exposed)',
				properties: {
					id: { type: 'integer' },
					keyPrefix: {
						type: 'string',
						description:
							'First 16 characters of the key for identification (e.g., lmx_abc123def456)'
					},
					name: { type: 'string', description: 'Human-readable key name' },
					tier: {
						type: 'string',
						enum: ['free', 'developer', 'pro', 'enterprise'],
						description: 'Rate limit tier'
					},
					isActive: { type: 'boolean' },
					usageCount: { type: 'integer', description: 'Total requests made with this key' },
					lastUsedAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
						description: 'Last time this key was used'
					},
					createdAt: { type: 'string', format: 'date-time' },
					expiresAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
						description: 'Key expiration date (null = no expiry)'
					},
					revokedAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
						description: 'When the key was revoked (null = active)'
					}
				},
				required: ['id', 'keyPrefix', 'name', 'tier', 'isActive']
			},
			CreateApiKeyInput: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						minLength: 1,
						maxLength: 100,
						description: 'Human-readable name for the key'
					},
					expiresAt: {
						type: 'string',
						format: 'date-time',
						description: 'Optional expiration date (ISO 8601)'
					}
				},
				required: ['name']
			},
			ApiKeyCreated: {
				type: 'object',
				description: 'Response when creating a new API key',
				properties: {
					key: { $ref: '#/components/schemas/ApiKey' },
					rawKey: {
						type: 'string',
						description: 'The full API key — **store this securely, it will not be shown again**'
					},
					warning: { type: 'string' }
				},
				required: ['key', 'rawKey', 'warning']
			},
			WaitlistInput: {
				type: 'object',
				properties: {
					email: {
						type: 'string',
						format: 'email',
						maxLength: 255,
						description: 'Email address to add to the waitlist'
					}
				},
				required: ['email']
			}
		},
		responses: {
			Unauthorized: {
				description: 'Missing or invalid API key',
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/Error' },
						example: { error: 'API key required', message: 'Include X-API-Key header' }
					}
				}
			},
			Forbidden: {
				description: 'Insufficient permissions (enterprise tier required)',
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/Error' },
						example: { error: 'Forbidden: admin access required' }
					}
				}
			},
			ValidationError: {
				description: 'Invalid request parameters or body',
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/Error' },
						example: { error: 'Invalid ID parameter' }
					}
				}
			},
			UnsupportedMediaType: {
				description: 'Request body must be JSON',
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/Error' },
						example: { error: 'Content-Type must be application/json' }
					}
				}
			},
			RateLimited: {
				description: 'Rate limit exceeded',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								error: { type: 'string' },
								retryAfter: {
									type: 'integer',
									description: 'Seconds until the rate limit resets'
								}
							}
						},
						example: { error: 'Rate limit exceeded', retryAfter: 3600 }
					}
				},
				headers: {
					'Retry-After': {
						schema: { type: 'integer' },
						description: 'Seconds until the rate limit resets'
					}
				}
			}
		},
		securitySchemes: {
			ApiKeyAuth: {
				type: 'apiKey',
				in: 'header',
				name: 'X-API-Key',
				description:
					'API key for authentication. Format: `lmx_...` (44 characters). Pass via the X-API-Key header.'
			}
		}
	},
	security: [{ ApiKeyAuth: [] }]
} as const;
