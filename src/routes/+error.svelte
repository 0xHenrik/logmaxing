<script lang="ts">
	import { page } from '$app/stores';

	const errorMessages: Record<number, string> = {
		404: 'The page you were looking for could not be found.',
		500: 'Something went wrong on our end. Please try again.',
		403: "You don't have permission to access this resource."
	};

	$: status = $page.status;
	$: message = errorMessages[status] || $page.error?.message || 'An unexpected error occurred.';
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
	<div class="text-center">
		<h1 class="text-7xl font-bold text-purple-400">{status}</h1>
		<p class="mt-4 text-xl text-zinc-400">{message}</p>
		<div class="mt-8 flex items-center justify-center gap-4">
			<a
				href="/"
				class="inline-block rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-500"
			>
				Go Home
			</a>
			{#if status === 500}
				<button
					onclick={() => location.reload()}
					class="inline-block rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition-colors hover:border-zinc-500"
				>
					Try Again
				</button>
			{/if}
		</div>
	</div>
</div>
