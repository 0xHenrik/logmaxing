import type { RequestHandler } from '@sveltejs/kit';

import { redirect } from '@sveltejs/kit';

import { getOrCreateUserProfile } from '$lib/server/api/userProfile';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');
	const next = url.searchParams.get('next') ?? '/';

	// Log all params for debugging
	console.log('[auth/callback] params:', { code: !!code, token_hash: !!token_hash, type, next });
	console.log('[auth/callback] full URL:', url.toString());

	// PKCE flow (OAuth and newer email confirmations)
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		console.log('[auth/callback] code exchange result:', error ? error.message : 'success');

		if (!error) {
			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (user) {
				await getOrCreateUserProfile(
					user.id,
					user.email ?? '',
					user.user_metadata?.full_name ?? user.user_metadata?.name
				);
			}
			redirect(303, `/${next.slice(1)}`);
		}
	}

	// Token hash flow (email confirmation links)
	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({
			token_hash,
			type: type as 'signup' | 'email'
		});
		console.log('[auth/callback] token_hash verify result:', error ? error.message : 'success');

		if (!error) {
			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (user) {
				await getOrCreateUserProfile(
					user.id,
					user.email ?? '',
					user.user_metadata?.full_name ?? user.user_metadata?.name
				);
			}
			redirect(303, `/${next.slice(1)}`);
		}
	}

	// Supabase redirects with error params when the link is invalid/expired
	const errorDesc = url.searchParams.get('error_description');
	const errorMsg = errorDesc ? encodeURIComponent(errorDesc) : '';
	redirect(303, `/auth/auth-code-error${errorMsg ? `?message=${errorMsg}` : ''}`);
};
