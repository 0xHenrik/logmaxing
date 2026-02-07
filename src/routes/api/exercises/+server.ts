import type { RequestHandler } from '@sveltejs/kit';

import { getExercises } from '$lib/server/api/exercises';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') ?? undefined;
	const muscleId = url.searchParams.get('muscleId');
	const muscleGroup = url.searchParams.get('muscleGroup') ?? undefined;
	const equipmentId = url.searchParams.get('equipmentId');

	// Biomechanics filters
	const difficulty = url.searchParams.get('difficulty') ?? undefined;
	const movementPattern = url.searchParams.get('movementPattern') ?? undefined;
	const forceProfile = url.searchParams.get('forceProfile') ?? undefined;
	const stretchPosition = url.searchParams.get('stretchPosition') ?? undefined;
	const unilateralParam = url.searchParams.get('unilateral');
	const unilateral =
		unilateralParam === 'true' ? true : unilateralParam === 'false' ? false : undefined;
	const gripType = url.searchParams.get('gripType') ?? undefined;

	// Pagination
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');

	const data = await getExercises({
		search,
		muscleId: muscleId ? Number(muscleId) : undefined,
		muscleGroup,
		equipmentId: equipmentId ? Number(equipmentId) : undefined,
		difficulty,
		movementPattern,
		forceProfile,
		stretchPosition,
		unilateral,
		gripType,
		limit: limit ? Number(limit) : 50,
		offset: offset ? Number(offset) : 0
	});

	return Response.json(data);
};
