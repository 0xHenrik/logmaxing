import type { RequestHandler } from '@sveltejs/kit';

import { openApiSpec } from '$lib/server/api/openapi';

export const GET: RequestHandler = async ({ request }) => {
	const origin = request.headers.get('Origin') ?? '';
	const allowed = [
		'https://logmaxing.tech',
		'https://www.logmaxing.tech',
		'https://api.logmaxing.tech'
	];
	const corsOrigin = allowed.includes(origin) ? origin : 'https://logmaxing.tech';

	return Response.json(openApiSpec, {
		headers: {
			'Access-Control-Allow-Origin': corsOrigin,
			'Access-Control-Allow-Methods': 'GET',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
