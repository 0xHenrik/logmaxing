import type { RequestHandler } from '@sveltejs/kit';

import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	await supabase.auth.signOut();
	redirect(303, '/');
};
