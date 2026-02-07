import type { RequestHandler } from '@sveltejs/kit';
import type { TargetLevel, TrainingSplit } from '$lib/server/api/periodization';

import { getAllTemplates, filterTemplates } from '$lib/server/api/periodization';

const VALID_SPLITS: TrainingSplit[] = ['push_pull_legs', 'upper_lower', 'full_body'];
const VALID_LEVELS: TargetLevel[] = ['beginner', 'intermediate', 'advanced'];

export const GET: RequestHandler = async ({ url }) => {
	const splitParam = url.searchParams.get('split');
	const daysParam = url.searchParams.get('days');
	const levelParam = url.searchParams.get('level');
	const tagsParam = url.searchParams.get('tags');

	// Validate days
	if (daysParam) {
		const days = Number(daysParam);
		if (!Number.isFinite(days) || days < 1 || days > 7) {
			return Response.json({ error: 'days must be between 1 and 7' }, { status: 400 });
		}
	}

	// Validate split
	if (splitParam && !VALID_SPLITS.includes(splitParam as TrainingSplit)) {
		return Response.json(
			{ error: `Invalid split. Must be one of: ${VALID_SPLITS.join(', ')}` },
			{ status: 400 }
		);
	}

	// Validate level
	if (levelParam && !VALID_LEVELS.includes(levelParam as TargetLevel)) {
		return Response.json(
			{ error: `Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}` },
			{ status: 400 }
		);
	}

	const hasFilters = splitParam || daysParam || levelParam || tagsParam;

	if (!hasFilters) {
		return Response.json(getAllTemplates());
	}

	const results = filterTemplates({
		split: splitParam as TrainingSplit | undefined,
		daysPerWeek: daysParam ? Number(daysParam) : undefined,
		targetLevel: levelParam as TargetLevel | undefined,
		tags: tagsParam ? tagsParam.split(',') : undefined
	});

	return Response.json(results);
};
