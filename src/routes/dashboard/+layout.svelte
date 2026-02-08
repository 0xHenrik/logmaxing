<script lang="ts">
	import { page } from '$app/state';

	let { children, data } = $props();
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ label: 'Overview', href: '/dashboard', icon: 'grid' },
		{ label: 'Documentation', href: '/docs', icon: 'book', external: true }
	];

	function isActive(href: string): boolean {
		return page.url.pathname === href;
	}
</script>

<svelte:head>
	<title>Dashboard | Logmaxing</title>
</svelte:head>

<div class="flex min-h-screen bg-zinc-950">
	<!-- Desktop sidebar -->
	<aside
		class="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-zinc-800/50 bg-linear-to-b from-zinc-950 to-zinc-900/20 lg:block"
	>
		<div class="flex h-full flex-col">
			<!-- Logo -->
			<div class="flex h-14 items-center border-b border-zinc-800/50 px-5">
				<a href="/" class="text-lg font-bold tracking-tight">
					<span class="text-purple-400">log</span><span class="text-zinc-100">maxing</span>
				</a>
			</div>

			<!-- Nav -->
			<nav class="flex-1 space-y-0.5 px-3 py-3" aria-label="Dashboard navigation">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						target={item.external ? '_blank' : undefined}
						rel={item.external ? 'noopener noreferrer' : undefined}
						class="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 {isActive(
							item.href
						)
							? 'bg-zinc-800/50 text-zinc-100'
							: 'text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200'}"
					>
						{#if item.icon === 'grid'}
							<svg
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
								/>
							</svg>
						{:else if item.icon === 'book'}
							<svg
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
								/>
							</svg>
						{/if}
						{item.label}
						{#if item.external}
							<svg
								class="ml-auto h-3 w-3 text-zinc-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
								/>
							</svg>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- User section -->
			<div class="border-t border-zinc-800/50 px-3 py-3">
				<div class="mb-2 rounded-md px-3 py-2">
					<p class="truncate text-[13px] font-medium text-zinc-200">
						{data.profile.name ?? 'Developer'}
					</p>
					<p class="truncate text-[11px] text-zinc-500">{data.profile.email}</p>
				</div>
				<form method="POST" action="/auth/sign-out">
					<button
						type="submit"
						class="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-zinc-400 transition-colors duration-150 hover:bg-zinc-800/30 hover:text-zinc-200"
					>
						<svg
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
							/>
						</svg>
						Sign Out
					</button>
				</form>
			</div>
		</div>
	</aside>

	<!-- Mobile top bar -->
	<div
		class="fixed inset-x-0 top-0 z-30 flex h-12 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/95 px-4 backdrop-blur-sm lg:hidden"
	>
		<a href="/" class="text-lg font-bold tracking-tight">
			<span class="text-purple-400">log</span><span class="text-zinc-100">maxing</span>
		</a>
		<button
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200"
			aria-label="Toggle menu"
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				{#if mobileMenuOpen}
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile menu overlay -->
	{#if mobileMenuOpen}
		<div class="fixed inset-0 z-40 lg:hidden">
			<!-- Backdrop -->
			<button
				class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
				onclick={() => (mobileMenuOpen = false)}
				aria-label="Close menu"
			></button>
			<!-- Menu -->
			<div class="absolute top-0 left-0 h-full w-56 border-r border-zinc-800/50 bg-zinc-950">
				<div class="flex h-12 items-center border-b border-zinc-800/50 px-5">
					<a href="/" class="text-lg font-bold tracking-tight">
						<span class="text-purple-400">log</span><span class="text-zinc-100">maxing</span>
					</a>
				</div>
				<nav class="space-y-0.5 px-3 py-3">
					{#each navItems as item (item.href)}
						<a
							href={item.href}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noopener noreferrer' : undefined}
							onclick={() => (mobileMenuOpen = false)}
							class="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 {isActive(
								item.href
							)
								? 'bg-zinc-800/50 text-zinc-100'
								: 'text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200'}"
						>
							{item.label}
						</a>
					{/each}
				</nav>
				<div class="border-t border-zinc-800/50 px-3 py-3">
					<p class="truncate px-3 text-[13px] text-zinc-400">{data.profile.email}</p>
					<form method="POST" action="/auth/sign-out" class="mt-2">
						<button
							type="submit"
							class="w-full rounded-md px-3 py-1.5 text-left text-[13px] font-medium text-zinc-400 transition-colors hover:bg-zinc-800/30 hover:text-zinc-200"
						>
							Sign Out
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<!-- Main content -->
	<main class="min-h-screen flex-1 pt-12 lg:ml-56 lg:pt-0">
		<div class="mx-auto max-w-5xl px-6 py-8">
			{@render children()}
		</div>
	</main>
</div>
