import type { RequestHandler } from '@sveltejs/kit';

import { parseId } from '$lib/server/api/validation';
import { getExercise } from '$lib/server/api/exercises';

export const GET: RequestHandler = async ({ params }) => {
	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const data = await getExercise(id);
	if (!data) {
		return Response.json({ error: 'Not found' }, { status: 404 });
	}

	return Response.json(data);
};
