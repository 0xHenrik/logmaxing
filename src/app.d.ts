// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { UserProfile } from '$lib/server/db/schema';
import type { ValidatedApiKey } from '$lib/server/api/apiKeys';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			user?: User;
			userProfile?: UserProfile;
			apiKey?: ValidatedApiKey;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
