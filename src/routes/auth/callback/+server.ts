import type { RequestHandler } from '@sveltejs/kit';

import { redirect } from '@sveltejs/kit';

import { getOrCreateUserProfile } from '$lib/server/api/userProfile';

/** Validate redirect target is a safe internal path (prevents open redirect). */
function safeRedirect(next: string | null): string {
	if (!next) return '/';
	// Strip leading slashes to prevent protocol-relative redirects (//evil.com)
	const cleaned = next.replace(/^\/+/, '');
	// Block colons (protocol), backslashes, and relative traversal
	if (/[:\\]/.test(cleaned) || cleaned.startsWith('.')) return '/';
	return `/${cleaned}`;
}

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');
	const next = safeRedirect(url.searchParams.get('next'));

	// PKCE flow (OAuth and newer email confirmations)
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);

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
			redirect(303, next);
		}
	}

	// Token hash flow (email confirmation links)
	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({
			token_hash,
			type: type as 'signup' | 'email'
		});

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
			redirect(303, next);
		}
	}

	// Auth failed — redirect to error page with a safe error code
	const errorDesc = url.searchParams.get('error_description');
	const errorCode = errorDesc?.includes('expired')
		? 'expired'
		: errorDesc?.includes('invalid')
			? 'invalid'
			: 'unknown';
	redirect(303, `/auth/auth-code-error?error=${errorCode}`);
};
