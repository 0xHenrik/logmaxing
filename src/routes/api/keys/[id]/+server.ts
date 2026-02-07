import type { RequestHandler } from '@sveltejs/kit';

import { parseId } from '$lib/server/api/validation';
import { deleteApiKey, getApiKeyById } from '$lib/server/api/apiKeys';

// Get single key details
export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.apiKey) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const key = await getApiKeyById(id, locals.apiKey.userId);

	if (!key) {
		return Response.json({ error: 'Key not found' }, { status: 404 });
	}

	return Response.json(key);
};

// Permanently delete key
export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.apiKey) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const deleted = await deleteApiKey(id, locals.apiKey.userId);

	if (!deleted) {
		return Response.json({ error: 'Key not found' }, { status: 404 });
	}

	return new Response(null, { status: 204 });
};
