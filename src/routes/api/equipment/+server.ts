import type { RequestHandler } from '@sveltejs/kit';

import { getAllEquipment } from '$lib/server/api/exercises';

export const GET: RequestHandler = async () => {
	const data = await getAllEquipment();
	return Response.json(data);
};
