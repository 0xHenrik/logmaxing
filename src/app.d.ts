// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { ValidatedApiKey } from '$lib/server/api/apiKeys';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			apiKey?: ValidatedApiKey;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
