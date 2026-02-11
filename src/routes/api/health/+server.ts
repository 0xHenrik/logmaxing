import type { RequestHandler } from '@sveltejs/kit';

import { sql } from 'drizzle-orm';

import { db } from '$lib/server/db';

export const GET: RequestHandler = async () => {
	try {
		await db.execute(sql`SELECT 1`);

		return Response.json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			version: '1.0.0',
			checks: {
				database: 'connected'
			}
		});
	} catch {
		return Response.json(
			{
				status: 'unhealthy',
				timestamp: new Date().toISOString(),
				checks: {
					database: 'disconnected'
				}
			},
			{ status: 503 }
		);
	}
};
