<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Load Scalar API Reference
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';
		script.onload = () => {
			// Scalar auto-initializes when it finds the api-reference element
		};
		document.head.appendChild(script);
	});
</script>

<svelte:head>
	<title>API Documentation | Logmaxing</title>
	<meta name="description" content="Logmaxing Training Science API documentation" />
</svelte:head>

<div
	id="api-reference"
	data-url="/api/openapi.json"
	data-configuration={JSON.stringify({
		theme: 'purple',
		layout: 'modern',
		darkMode: true,
		hideDarkModeToggle: false,
		showSidebar: true,
		hideDownloadButton: false,
		hideModels: false,
		hideClientButton: false,
		defaultHttpClient: {
			targetKey: 'javascript',
			clientKey: 'fetch'
		},
		metaData: {
			title: 'Logmaxing API',
			description: 'Training Science API'
		}
	})}
></div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	#api-reference {
		min-height: 100vh;
	}
</style>
