<script lang="ts">
	let { data } = $props();

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let success = $state(false);

	async function handleSignUp() {
		loading = true;
		error = '';

		const { error: authError } = await data.supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
		});

		if (authError) {
			error = authError.message;
			loading = false;
			return;
		}

		success = true;
		loading = false;
	}

	async function handleOAuth(provider: 'google' | 'apple') {
		await data.supabase.auth.signInWithOAuth({
			provider,
			options: { redirectTo: `${window.location.origin}/auth/callback` }
		});
	}
</script>

<svelte:head>
	<title>Sign Up | Logmaxing</title>
	<meta name="description" content="Create your Logmaxing account." />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<a href="/" class="text-2xl font-bold tracking-tight">
				<span class="text-purple-400">log</span><span class="text-zinc-100">maxing</span>
			</a>
			<p class="mt-2 text-sm text-zinc-400">Create your account</p>
		</div>

		<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
			{#if success}
				<div class="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-4 text-center">
					<p class="font-medium text-green-300">Check your email</p>
					<p class="mt-1 text-sm text-green-400/70">
						We sent a confirmation link to <strong class="text-green-300">{email}</strong>. Click it
						to activate your account.
					</p>
				</div>
			{:else}
				<form onsubmit={handleSignUp} class="space-y-4">
					<div>
						<label for="email" class="mb-1 block text-sm font-medium text-zinc-300">Email</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							disabled={loading}
							class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none disabled:opacity-50"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label for="password" class="mb-1 block text-sm font-medium text-zinc-300"
							>Password</label
						>
						<input
							id="password"
							type="password"
							bind:value={password}
							required
							disabled={loading}
							minlength={6}
							class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none disabled:opacity-50"
							placeholder="Min. 6 characters"
						/>
					</div>

					{#if error}
						<p class="text-sm text-red-400">{error}</p>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
					>
						{loading ? 'Creating account...' : 'Create Account'}
					</button>
				</form>

				<div class="my-6 flex items-center gap-3">
					<div class="h-px flex-1 bg-zinc-800"></div>
					<span class="text-xs text-zinc-500">or continue with</span>
					<div class="h-px flex-1 bg-zinc-800"></div>
				</div>

				<div class="space-y-3">
					<button
						onclick={() => handleOAuth('google')}
						class="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Google
					</button>

					<button
						onclick={() => handleOAuth('apple')}
						class="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
							/>
						</svg>
						Apple
					</button>
				</div>
			{/if}
		</div>

		<p class="mt-6 text-center text-sm text-zinc-400">
			Already have an account?
			<a href="/sign-in" class="text-purple-400 transition-colors hover:text-purple-300">Sign in</a>
		</p>
	</div>
</div>
