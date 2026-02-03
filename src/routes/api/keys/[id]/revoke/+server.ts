import type { RequestHandler } from '@sveltejs/kit';

import { revokeApiKey } from '$lib/server/api/apiKeys';

// Revoke key (soft delete - keeps audit trail)
export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.apiKey) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const revoked = await revokeApiKey(Number(params.id), locals.apiKey.userId);

	if (!revoked) {
		return Response.json({ error: 'Key not found' }, { status: 404 });
	}

	return Response.json({ message: 'Key revoked successfully' });
};
