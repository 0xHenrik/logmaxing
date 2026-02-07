<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { invalidate } from '$app/navigation';

	import favicon from '$lib/assets/favicon.svg';

	import './layout.css';

	let { children, data } = $props();

	const canonicalUrl = $derived(`https://logmaxing.tech${page.url.pathname}`);

	onMount(() => {
		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange(
			(_: unknown, newSession: { expires_at?: number } | null) => {
				if (newSession?.expires_at !== data.session?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		);

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-white"
>
	Skip to main content
</a>
{@render children()}
