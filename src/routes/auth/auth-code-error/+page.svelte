<script lang="ts">
	import { page } from '$app/state';

	const ERROR_MESSAGES: Record<string, string> = {
		expired: 'The authentication link has expired. Please try signing in again.',
		invalid: 'The authentication link is invalid. Please try signing in again.',
		unknown: 'Something went wrong during authentication. Please try signing in again.'
	};

	const message = $derived(
		ERROR_MESSAGES[page.url.searchParams.get('error') ?? ''] ?? ERROR_MESSAGES.unknown
	);
</script>

<svelte:head>
	<title>Authentication Error | Logmaxing</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
	<div class="w-full max-w-sm text-center">
		<div class="mb-8">
			<a href="/" class="text-2xl font-bold tracking-tight">
				<span class="text-purple-400">log</span><span class="text-zinc-100">maxing</span>
			</a>
		</div>

		<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
			<h1 class="mb-2 text-lg font-semibold text-zinc-100">Authentication Failed</h1>
			<p class="mb-6 text-sm text-zinc-400">
				{message}
			</p>
			<a
				href="/sign-up"
				class="inline-block rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
			>
				Try Again
			</a>
		</div>
	</div>
</div>
