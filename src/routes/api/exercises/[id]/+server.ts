import type { RequestHandler } from '@sveltejs/kit';

import { getExercise } from '$lib/server/api/exercises';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	const data = await getExercise(Number(id));

	if (!data) {
		return new Response('not found', { status: 404 });
	}

	return Response.json(data);
};
