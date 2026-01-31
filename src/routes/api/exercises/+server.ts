import type { RequestHandler } from '@sveltejs/kit';

import { getExercises } from '$lib/server/api/exercises';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') ?? undefined;
	const muscleId = url.searchParams.get('muscleId');
	const muscleGroup = url.searchParams.get('muscleGroup') ?? undefined;
	const equipmentId = url.searchParams.get('equipmentId');
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');

	const data = await getExercises({
		search,
		muscleId: muscleId ? Number(muscleId) : undefined,
		muscleGroup,
		equipmentId: equipmentId ? Number(equipmentId) : undefined,
		limit: limit ? Number(limit) : 50,
		offset: offset ? Number(offset) : 0
	});

	return Response.json(data);
};
