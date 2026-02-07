import type { RequestHandler } from '@sveltejs/kit';

import { parseId } from '$lib/server/api/validation';
import { revokeApiKey } from '$lib/server/api/apiKeys';

// Revoke key (soft delete - keeps audit trail)
export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.apiKey) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const revoked = await revokeApiKey(id, locals.apiKey.userId);

	if (!revoked) {
		return Response.json({ error: 'Key not found' }, { status: 404 });
	}

	return Response.json({ message: 'Key revoked successfully' });
};
