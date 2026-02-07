import type { RequestHandler } from '@sveltejs/kit';

import { parseId } from '$lib/server/api/validation';
import { getExercises } from '$lib/server/api/exercises';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') ?? undefined;
	const muscleIdParam = url.searchParams.get('muscleId');
	const muscleGroup = url.searchParams.get('muscleGroup') ?? undefined;
	const equipmentIdParam = url.searchParams.get('equipmentId');

	// Validate numeric query params
	const muscleId = muscleIdParam ? parseId(muscleIdParam) : undefined;
	if (muscleIdParam && muscleId === null) {
		return Response.json({ error: 'muscleId must be a positive integer' }, { status: 400 });
	}

	const equipmentId = equipmentIdParam ? parseId(equipmentIdParam) : undefined;
	if (equipmentIdParam && equipmentId === null) {
		return Response.json({ error: 'equipmentId must be a positive integer' }, { status: 400 });
	}

	// Biomechanics filters
	const difficulty = url.searchParams.get('difficulty') ?? undefined;
	const movementPattern = url.searchParams.get('movementPattern') ?? undefined;
	const forceProfile = url.searchParams.get('forceProfile') ?? undefined;
	const stretchPosition = url.searchParams.get('stretchPosition') ?? undefined;
	const unilateralParam = url.searchParams.get('unilateral');
	const unilateral =
		unilateralParam === 'true' ? true : unilateralParam === 'false' ? false : undefined;
	const gripType = url.searchParams.get('gripType') ?? undefined;

	// Pagination — clamp to safe bounds
	const rawLimit = url.searchParams.get('limit');
	const rawOffset = url.searchParams.get('offset');
	const parsedLimit = rawLimit ? Number(rawLimit) : 50;
	const parsedOffset = rawOffset ? Number(rawOffset) : 0;

	const data = await getExercises({
		search,
		muscleId: muscleId ?? undefined,
		muscleGroup,
		equipmentId: equipmentId ?? undefined,
		difficulty,
		movementPattern,
		forceProfile,
		stretchPosition,
		unilateral,
		gripType,
		limit: Number.isFinite(parsedLimit) ? Math.min(Math.max(Math.floor(parsedLimit), 1), 100) : 50,
		offset: Number.isFinite(parsedOffset)
			? Math.min(Math.max(Math.floor(parsedOffset), 0), Number.MAX_SAFE_INTEGER)
			: 0
	});

	return Response.json(data);
};
