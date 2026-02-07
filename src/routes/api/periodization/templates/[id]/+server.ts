import type { RequestHandler } from '@sveltejs/kit';

import { getTemplateById } from '$lib/server/api/periodization';

export const GET: RequestHandler = async ({ params }) => {
	if (!params.id) {
		return Response.json({ error: 'Template ID required' }, { status: 400 });
	}

	const template = getTemplateById(params.id);

	if (!template) {
		return Response.json({ error: 'Template not found' }, { status: 404 });
	}

	return Response.json(template);
};
