import type { RequestHandler } from '@sveltejs/kit';

import { updateMuscle } from '$lib/server/api/muscles';
import { getMuscle, deleteMuscle } from '$lib/server/api/muscles';

export const PUT = async ({ request, params }) => {
	const { id } = params;
	const data = await request.json();
	await updateMuscle(Number(id), data);
	return new Response('updated', { status: 200 });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;
	const data = await deleteMuscle(Number(id));
	if (!data) {
		return new Response('not found', { status: 404 });
	}
	return new Response('deleted muscle:' + data.deletedId, { status: 200 });
};

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	const data = await getMuscle(Number(id));
	if (data.length === 0) {
		return new Response('not found', { status: 404 });
	}
	return Response.json(data);
};
