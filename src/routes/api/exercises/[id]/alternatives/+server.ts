import type { RequestHandler } from '@sveltejs/kit';

import { parseId } from '$lib/server/api/validation';
import { findAlternatives } from '$lib/server/api/alternatives';

export const GET: RequestHandler = async ({ params, url }) => {
	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid exercise ID' }, { status: 400 });
	}

	// Parse equipment filter (comma-separated IDs)
	const equipmentParam = url.searchParams.get('equipment');
	const availableEquipmentIds = equipmentParam
		? equipmentParam
				.split(',')
				.map(Number)
				.filter((n) => Number.isFinite(n) && n > 0)
		: undefined;

	// Parse difficulty filter
	const difficultyParam = url.searchParams.get('difficulty');
	const validDifficulties = ['same', 'easier', 'harder', 'any'] as const;
	const difficulty =
		difficultyParam &&
		validDifficulties.includes(difficultyParam as (typeof validDifficulties)[number])
			? (difficultyParam as 'same' | 'easier' | 'harder' | 'any')
			: 'any';

	// Parse exclude filter (comma-separated IDs)
	const excludeParam = url.searchParams.get('exclude');
	const excludeExerciseIds = excludeParam
		? excludeParam
				.split(',')
				.map(Number)
				.filter((n) => Number.isFinite(n) && n > 0)
		: undefined;

	// Parse minSimilarity (0.0-1.0)
	const minSimilarityParam = url.searchParams.get('minSimilarity');
	const minSimilarity = minSimilarityParam
		? Math.max(0, Math.min(1, Number(minSimilarityParam) || 0.5))
		: 0.5;

	// Parse limit (1-50)
	const limitParam = url.searchParams.get('limit');
	const limit = limitParam ? Math.max(1, Math.min(50, Number(limitParam) || 10)) : 10;

	const result = await findAlternatives(id, {
		availableEquipmentIds,
		difficulty,
		excludeExerciseIds,
		minSimilarity,
		limit
	});

	if (!result) {
		return Response.json({ error: 'Exercise not found' }, { status: 404 });
	}

	return Response.json(result);
};
