import type { RequestHandler } from '@sveltejs/kit';

import { getMuscles, insertMuscle } from '$lib/server/api/muscles';

export const GET: RequestHandler = async () => {
	const data = await getMuscles();

	return Response.json(data);
};

export const POST = async ({ request }) => {
	const data = await request.json();
	await insertMuscle(data);
	return new Response('created', { status: 200 });
};
