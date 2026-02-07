<script lang="ts">
	import { page } from '$app/state';

	import favicon from '$lib/assets/favicon.svg';

	import './layout.css';

	let { children } = $props();

	const canonicalUrl = $derived(`https://logmaxing.tech${page.url.pathname}`);
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
