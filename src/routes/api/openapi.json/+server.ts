import type { RequestHandler } from '@sveltejs/kit';

import { openApiSpec } from '$lib/server/api/openapi';

export const GET: RequestHandler = async () => {
	return Response.json(openApiSpec, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
