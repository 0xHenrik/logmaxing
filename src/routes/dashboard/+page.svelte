<script lang="ts">
	import { enhance } from '$app/forms';
	import { fly, fade } from 'svelte/transition';

	let { data, form } = $props();

	// Modal states
	let showCreateModal = $state(false);
	let rawKeyDismissed = $state(false);
	let showRawKeyModal = $derived(!!form?.created && !rawKeyDismissed);
	let confirmAction = $state<{ type: 'revoke' | 'delete'; keyId: number; keyName: string } | null>(
		null
	);
	let copied = $state(false);
	let creating = $state(false);
	let checkoutStatus = $derived(
		typeof window !== 'undefined'
			? new URLSearchParams(window.location.search).get('checkout')
			: null
	);

	// Derived data
	let revokedKeys = $derived(
		data.keys.filter((k: { revokedAt: unknown; isActive: boolean }) => k.revokedAt || !k.isActive)
	);

	function formatRelativeTime(date: string | Date | null): string {
		if (!date) return 'Never';
		const now = Date.now();
		const then = new Date(date).getTime();
		const diff = now - then;
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (seconds < 60) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 30) return `${days}d ago`;
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function formatNumber(n: number): string {
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
		if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
		return n.toString();
	}

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	const upgradeTiers = [
		{ name: 'developer', price: '$29/mo', calls: '5,000/mo' },
		{ name: 'pro', price: '$99/mo', calls: '25,000/mo' },
		{ name: 'enterprise', price: '$299/mo', calls: '100,000/mo' }
	];

	function tierLabel(tier: string): string {
		return tier.charAt(0).toUpperCase() + tier.slice(1);
	}
</script>

<!-- Page header -->
<div class="mb-6 flex items-center justify-between">
	<div>
		<h1 class="text-xl font-semibold tracking-tight text-zinc-100">API Keys</h1>
		<p class="mt-1 text-[13px] text-zinc-500">Manage your API keys for the Training Science API</p>
	</div>
	<button
		onclick={() => {
			showCreateModal = true;
			rawKeyDismissed = false;
		}}
		class="rounded-lg bg-purple-600 px-3.5 py-2 text-[13px] font-medium text-white transition-all duration-150 hover:bg-purple-500 active:scale-[0.97]"
	>
		Create Key
	</button>
</div>

<!-- Stats grid -->
<div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<!-- Active Keys -->
	<div
		class="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all duration-200 hover:border-zinc-700/60"
	>
		<p class="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">Active Keys</p>
		<p class="mt-1.5 text-2xl font-semibold text-zinc-100 tabular-nums">
			{data.stats.activeKeys}
		</p>
		<p class="mt-1 text-[11px] text-zinc-600">
			{data.stats.activeKeys} / {data.stats.keyLimit} limit
		</p>
	</div>

	<!-- Total Requests -->
	<div
		class="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.06] to-transparent p-5 shadow-[0_0_20px_rgba(168,85,247,0.06)] transition-all duration-200 hover:border-purple-500/30"
	>
		<p class="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">Total Requests</p>
		<p class="mt-1.5 text-2xl font-semibold text-zinc-100 tabular-nums">
			{formatNumber(data.stats.totalUsage)}
		</p>
		<p class="mt-1 text-[11px] text-purple-400/60">Across all keys</p>
	</div>

	<!-- Current Tier -->
	<div
		class="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all duration-200 hover:border-zinc-700/60"
	>
		<p class="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">Current Tier</p>
		<p class="mt-1.5 text-2xl font-semibold text-zinc-100">{tierLabel(data.stats.tier)}</p>
		<p class="mt-1 text-[11px] text-zinc-600">
			{data.stats.tier === 'free'
				? '100 req/day'
				: data.stats.tier === 'developer'
					? '170 req/day'
					: data.stats.tier === 'pro'
						? '850 req/day'
						: '3,400 req/day'}
		</p>
	</div>

	<!-- All Keys -->
	<div
		class="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all duration-200 hover:border-zinc-700/60"
	>
		<p class="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">All Keys</p>
		<p class="mt-1.5 text-2xl font-semibold text-zinc-100 tabular-nums">{data.stats.totalKeys}</p>
		<p class="mt-1 text-[11px] text-zinc-600">
			{revokedKeys.length} revoked
		</p>
	</div>
</div>

<!-- Checkout status banner -->
{#if checkoutStatus === 'success'}
	<div
		class="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/6 px-4 py-3 text-[13px] text-emerald-300"
	>
		Subscription activated! Your tier has been upgraded.
	</div>
{:else if checkoutStatus === 'canceled'}
	<div
		class="mb-6 rounded-xl border border-zinc-700/40 bg-zinc-800/30 px-4 py-3 text-[13px] text-zinc-400"
	>
		Checkout canceled. No changes were made.
	</div>
{/if}

<!-- Subscription section -->
<div class="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">Subscription</p>
			<p class="mt-1 text-lg font-semibold text-zinc-100 capitalize">
				{data.profile.subscriptionTier} Plan
			</p>
			{#if data.profile.subscriptionStatus === 'active' && data.profile.subscriptionCurrentPeriodEnd}
				<p class="mt-0.5 text-[11px] text-zinc-500">
					Renews {new Date(data.profile.subscriptionCurrentPeriodEnd).toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric'
					})}
				</p>
			{:else if data.profile.subscriptionStatus === 'canceled'}
				<p class="mt-0.5 text-[11px] text-amber-400/80">Canceled — reverts to Free at period end</p>
			{:else if data.profile.subscriptionStatus === 'past_due'}
				<p class="mt-0.5 text-[11px] text-red-400/80">Payment past due — update billing info</p>
			{/if}
		</div>

		{#if data.profile.subscriptionTier !== 'free'}
			<form method="POST" action="?/manageBilling" use:enhance>
				<button
					type="submit"
					class="rounded-lg border border-zinc-700 px-3.5 py-2 text-[13px] font-medium text-zinc-300 transition-all duration-150 hover:border-zinc-600 hover:text-zinc-100 active:scale-[0.97]"
				>
					Manage Billing
				</button>
			</form>
		{/if}
	</div>

	{#if data.profile.subscriptionTier === 'free'}
		<div class="mt-4 grid gap-2 sm:grid-cols-3">
			{#each upgradeTiers as tier (tier.name)}
				<form method="POST" action="?/checkout" use:enhance>
					<input type="hidden" name="tier" value={tier.name} />
					<button
						type="submit"
						class="w-full rounded-lg border border-zinc-700 px-3.5 py-3 text-left transition-all duration-150 hover:border-purple-500/50 hover:bg-purple-500/4 active:scale-[0.98]"
					>
						<p class="text-[13px] font-medium text-zinc-200 capitalize">{tier.name}</p>
						<p class="text-[12px] text-zinc-500">{tier.price} &middot; {tier.calls}</p>
					</button>
				</form>
			{/each}
		</div>
	{/if}
</div>

<!-- Key list -->
{#if data.keys.length === 0}
	<!-- Empty state -->
	<div
		class="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/40 py-16"
	>
		<svg
			class="mb-3 h-10 w-10 text-zinc-700"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="1"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
			/>
		</svg>
		<p class="mb-1 text-sm font-medium text-zinc-300">No API keys yet</p>
		<p class="mb-5 text-[13px] text-zinc-500">Create your first key to start using the API</p>
		<button
			onclick={() => {
				showCreateModal = true;
				rawKeyDismissed = false;
			}}
			class="rounded-lg bg-purple-600 px-3.5 py-2 text-[13px] font-medium text-white transition-all duration-150 hover:bg-purple-500 active:scale-[0.97]"
		>
			Create Key
		</button>
	</div>
{:else}
	<div class="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/30">
		<!-- Table header -->
		<div
			class="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-zinc-800/40 px-4 py-2.5 text-[11px] font-medium tracking-wider text-zinc-500 uppercase sm:grid-cols-[1fr_140px_100px_80px_80px]"
		>
			<span>Key</span>
			<span class="hidden sm:block">Last Used</span>
			<span class="hidden sm:block">Requests</span>
			<span class="hidden sm:block">Status</span>
			<span class="text-right">Actions</span>
		</div>

		<!-- Key rows -->
		{#each data.keys as key (key.id)}
			<div
				class="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-zinc-800/30 px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-zinc-800/20 sm:grid-cols-[1fr_140px_100px_80px_80px]"
			>
				<!-- Key info -->
				<div class="min-w-0">
					<p class="truncate text-[13px] font-medium text-zinc-200">{key.name}</p>
					<p class="mt-0.5">
						<span
							class="inline-block rounded bg-zinc-800/50 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500"
						>
							{key.keyPrefix}...
						</span>
					</p>
				</div>

				<!-- Last used -->
				<p class="hidden text-[13px] text-zinc-500 sm:block">
					{formatRelativeTime(key.lastUsedAt)}
				</p>

				<!-- Request count -->
				<p class="hidden font-mono text-[13px] text-zinc-400 tabular-nums sm:block">
					{formatNumber(key.usageCount)}
				</p>

				<!-- Status -->
				<div class="hidden sm:block">
					{#if key.revokedAt || !key.isActive}
						<span
							class="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-400"
						>
							<span class="h-1.5 w-1.5 rounded-full bg-red-400"></span>
							Revoked
						</span>
					{:else if key.expiresAt && new Date(key.expiresAt) < new Date()}
						<span
							class="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2 py-0.5 text-[11px] font-medium text-zinc-400"
						>
							<span class="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>
							Expired
						</span>
					{:else}
						<span
							class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400"
						>
							<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
							Active
						</span>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-end gap-1">
					{#if key.isActive && !key.revokedAt}
						<button
							onclick={() => (confirmAction = { type: 'revoke', keyId: key.id, keyName: key.name })}
							class="rounded-md px-2 py-1 text-[11px] font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-800/50 hover:text-amber-400 active:scale-[0.97]"
							title="Revoke key"
						>
							Revoke
						</button>
					{/if}
					<button
						onclick={() => (confirmAction = { type: 'delete', keyId: key.id, keyName: key.name })}
						class="rounded-md px-2 py-1 text-[11px] font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-800/50 hover:text-red-400 active:scale-[0.97]"
						title="Delete key"
					>
						Delete
					</button>
				</div>
			</div>
		{/each}
	</div>
{/if}

<!-- Create Key Modal -->
{#if showCreateModal && !showRawKeyModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center px-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="create-key-title"
	>
		<button
			class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
			onclick={() => (showCreateModal = false)}
			aria-label="Close"
			transition:fade={{ duration: 150 }}
		></button>
		<div
			class="relative w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
			transition:fly={{ y: 8, duration: 150 }}
		>
			<h2 id="create-key-title" class="text-base font-semibold text-zinc-100">Create API Key</h2>
			<p class="mt-1 text-[13px] text-zinc-500">Give your key a name to identify it later.</p>

			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					creating = true;
					return async ({ update }) => {
						creating = false;
						await update();
					};
				}}
				class="mt-4"
			>
				<label for="key-name" class="mb-1.5 block text-[13px] font-medium text-zinc-300"
					>Key Name</label
				>
				<input
					id="key-name"
					name="name"
					type="text"
					required
					maxlength={100}
					disabled={creating}
					placeholder="e.g. Production, Development"
					class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-purple-500 focus:outline-none disabled:opacity-50"
				/>

				{#if form?.action === 'create' && form?.error}
					<p class="mt-2 text-[13px] text-red-400">{form.error}</p>
				{/if}

				<div class="mt-4 flex gap-2">
					<button
						type="button"
						onclick={() => (showCreateModal = false)}
						class="flex-1 rounded-lg border border-zinc-700 px-3.5 py-2.5 text-[13px] font-medium text-zinc-300 transition-all duration-150 hover:border-zinc-600 hover:text-zinc-100 active:scale-[0.97]"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={creating}
						class="flex-1 rounded-lg bg-purple-600 px-3.5 py-2.5 text-[13px] font-medium text-white transition-all duration-150 hover:bg-purple-500 active:scale-[0.97] disabled:opacity-50"
					>
						{creating ? 'Creating...' : 'Create'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Raw Key Display Modal -->
{#if showRawKeyModal && form?.rawKey}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center px-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="raw-key-title"
	>
		<div
			class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
			transition:fade={{ duration: 150 }}
		></div>
		<div
			class="relative w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
			transition:fly={{ y: 8, duration: 150 }}
		>
			<h2 id="raw-key-title" class="text-base font-semibold text-zinc-100">Key Created</h2>

			<!-- Warning -->
			<div class="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3.5 py-2.5">
				<p class="text-[13px] font-medium text-amber-300">
					This key will only be shown once. Copy it now.
				</p>
			</div>

			<!-- Key display -->
			<div class="mt-4">
				<p class="mb-1.5 text-[13px] font-medium text-zinc-400">{form.keyName}</p>
				<div class="flex items-center gap-2">
					<code
						class="flex-1 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 font-mono text-[13px] break-all text-zinc-100"
					>
						{form.rawKey}
					</code>
					<button
						onclick={() => copyToClipboard(form?.rawKey ?? '')}
						class="shrink-0 rounded-lg border border-zinc-700 p-2.5 text-zinc-400 transition-all duration-150 hover:border-zinc-600 hover:text-zinc-100 active:scale-[0.97]"
						title="Copy to clipboard"
					>
						{#if copied}
							<svg
								class="h-4 w-4 text-emerald-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						{:else}
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
									d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
								/>
							</svg>
						{/if}
					</button>
				</div>
			</div>

			<!-- Usage hint -->
			<div class="mt-4 rounded-lg border border-zinc-800/50 bg-zinc-950 px-3.5 py-2.5">
				<p class="mb-1 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">Usage</p>
				<code class="text-[12px] text-zinc-400">
					curl -H "X-API-Key: {form.rawKey?.slice(0, 16)}..." https://api.logmaxing.tech/exercises
				</code>
			</div>

			<button
				onclick={() => {
					rawKeyDismissed = true;
					showCreateModal = false;
				}}
				class="mt-4 w-full rounded-lg bg-purple-600 px-3.5 py-2.5 text-[13px] font-medium text-white transition-all duration-150 hover:bg-purple-500 active:scale-[0.97]"
			>
				Done
			</button>
		</div>
	</div>
{/if}

<!-- Confirm Dialog (Revoke/Delete) -->
{#if confirmAction}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center px-4"
		role="dialog"
		aria-modal="true"
	>
		<button
			class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
			onclick={() => (confirmAction = null)}
			aria-label="Close"
			transition:fade={{ duration: 150 }}
		></button>
		<div
			class="relative w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
			transition:fly={{ y: 8, duration: 150 }}
		>
			<h2 class="text-base font-semibold text-zinc-100">
				{confirmAction.type === 'revoke' ? 'Revoke' : 'Delete'} Key
			</h2>
			<p class="mt-2 text-[13px] leading-relaxed text-zinc-400">
				{#if confirmAction.type === 'revoke'}
					Revoking <span class="font-medium text-zinc-200">{confirmAction.keyName}</span> will immediately
					stop all API requests using this key. This can't be undone.
				{:else}
					Permanently delete <span class="font-medium text-zinc-200">{confirmAction.keyName}</span>?
					This removes all usage history and can't be undone.
				{/if}
			</p>

			<div class="mt-4 flex gap-2">
				<button
					type="button"
					onclick={() => (confirmAction = null)}
					class="flex-1 rounded-lg border border-zinc-700 px-3.5 py-2.5 text-[13px] font-medium text-zinc-300 transition-all duration-150 hover:border-zinc-600 hover:text-zinc-100 active:scale-[0.97]"
				>
					Cancel
				</button>
				<form
					method="POST"
					action="?/{confirmAction.type}"
					class="flex-1"
					use:enhance={() => {
						return async ({ update }) => {
							confirmAction = null;
							await update();
						};
					}}
				>
					<input type="hidden" name="keyId" value={confirmAction.keyId} />
					<button
						type="submit"
						class="w-full rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-white transition-all duration-150 active:scale-[0.97] {confirmAction.type ===
						'revoke'
							? 'bg-amber-600 hover:bg-amber-500'
							: 'bg-red-600 hover:bg-red-500'}"
					>
						{confirmAction.type === 'revoke' ? 'Revoke Key' : 'Delete Key'}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
