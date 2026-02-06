<script lang="ts">
	const endpoints = [
		{
			method: 'GET',
			path: '/api/muscles',
			desc: 'Muscle groups with MEV/MAV/MRV volume landmarks and recovery data'
		},
		{
			method: 'GET',
			path: '/api/exercises',
			desc: 'Exercise database with EMG activation data and biomechanics'
		},
		{
			method: 'POST',
			path: '/api/volume',
			desc: 'Calculate effective sets per muscle and check volume status'
		},
		{
			method: 'GET',
			path: '/api/muscles/:id',
			desc: 'Detailed muscle data including volume thresholds and training tips'
		}
	];

	const features = [
		{
			title: 'Volume Landmarks',
			desc: "MEV, MAV, and MRV thresholds for 19 muscle groups. Know exactly when you're under-training or overreaching.",
			icon: 'chart'
		},
		{
			title: '176 Exercises',
			desc: 'Every exercise mapped with EMG-backed muscle activation percentages, biomechanics classification, and form guidance.',
			icon: 'dumbbell'
		},
		{
			title: 'Volume Calculator',
			desc: 'Send a workout, get back effective sets per muscle with zone status: under, optimal, or over.',
			icon: 'calculator'
		},
		{
			title: 'Biomechanics Filters',
			desc: 'Filter exercises by difficulty, movement pattern, force profile, stretch position, and grip type.',
			icon: 'filter'
		}
	];

	const tiers = [
		{ name: 'Free', price: '$0', calls: '100/day', target: 'Evaluation & hobby projects' },
		{ name: 'Developer', price: '$29/mo', calls: '5,000/mo', target: 'Side projects & small apps' },
		{ name: 'Pro', price: '$99/mo', calls: '25,000/mo', target: 'Growing apps' },
		{ name: 'Enterprise', price: '$299/mo', calls: '100,000/mo', target: 'Large platforms' }
	];
</script>

<svelte:head>
	<title>Logmaxing — The Training Science API</title>
	<meta
		name="description"
		content="The first public API for exercise science data. EMG-backed muscle activation, volume landmarks, biomechanics, and more."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100">
	<!-- Nav -->
	<nav class="border-b border-zinc-800/50">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<a href="/" class="text-xl font-bold tracking-tight">
				<span class="text-purple-400">log</span>maxing
			</a>
			<div class="flex items-center gap-6">
				<a href="/docs" class="text-sm text-zinc-400 transition-colors hover:text-zinc-100">Docs</a>
				<a href="#pricing" class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
					>Pricing</a
				>
				<a
					href="/docs"
					class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500"
				>
					Get API Key
				</a>
			</div>
		</div>
	</nav>

	<!-- Hero -->
	<section class="px-6 pt-24 pb-20">
		<div class="mx-auto max-w-4xl text-center">
			<div
				class="mb-6 inline-block rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300"
			>
				Now in beta — free tier available
			</div>
			<h1 class="mb-6 text-5xl leading-tight font-bold tracking-tight md:text-6xl">
				The Training Science
				<span class="text-purple-400">API</span>
			</h1>
			<p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400">
				EMG-backed muscle activation data, volume landmarks (MEV/MAV/MRV), and a comprehensive
				exercise database with biomechanics classification. Built for fitness app developers.
			</p>
			<div class="flex items-center justify-center gap-4">
				<a
					href="/docs"
					class="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-500"
				>
					View API Docs
				</a>
				<a
					href="#endpoints"
					class="rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
				>
					See Endpoints
				</a>
			</div>
		</div>
	</section>

	<!-- Code Example -->
	<section class="px-6 pb-20">
		<div class="mx-auto max-w-3xl">
			<div class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
				<div class="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
					<div class="h-3 w-3 rounded-full bg-zinc-700"></div>
					<div class="h-3 w-3 rounded-full bg-zinc-700"></div>
					<div class="h-3 w-3 rounded-full bg-zinc-700"></div>
					<span class="ml-2 text-xs text-zinc-500">Terminal</span>
				</div>
				<div class="p-6">
					<pre class="text-sm leading-relaxed"><code
							><span class="text-zinc-500">$</span> <span class="text-purple-300">curl</span> <span
								class="text-zinc-400">-H</span
							> <span class="text-green-300">"X-API-Key: lmx_your_key"</span> \
  <span class="text-zinc-300"
								>https://logmaxing.tech/api/exercises?movementPattern=hip_hinge&difficulty=beginner</span
							>

<span class="text-zinc-500">// Response</span>
<span class="text-zinc-300"
								>[
  &#123; "id": 45, "name": "Romanian Deadlift",
    "primaryMuscle": "Hamstrings",
    "muscleGroup": "legs",
    "difficulty": "beginner",
    "movementPattern": "hip_hinge" &#125;,
  &#123; "id": 52, "name": "Good Morning", ... &#125;
]</span
							></code
						></pre>
				</div>
			</div>
		</div>
	</section>

	<!-- Features -->
	<section class="border-t border-zinc-800/50 px-6 py-20">
		<div class="mx-auto max-w-6xl">
			<h2 class="mb-4 text-center text-3xl font-bold">What's in the API</h2>
			<p class="mx-auto mb-14 max-w-xl text-center text-zinc-400">
				Data you'd spend months collecting, structured and ready to query.
			</p>
			<div class="grid gap-8 md:grid-cols-2">
				{#each features as feature (feature.title)}
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
						<h3 class="mb-2 text-lg font-semibold text-zinc-100">{feature.title}</h3>
						<p class="leading-relaxed text-zinc-400">{feature.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Endpoints -->
	<section id="endpoints" class="border-t border-zinc-800/50 px-6 py-20">
		<div class="mx-auto max-w-4xl">
			<h2 class="mb-4 text-center text-3xl font-bold">Endpoints</h2>
			<p class="mx-auto mb-14 max-w-xl text-center text-zinc-400">
				RESTful JSON API. API key auth via header. That's it.
			</p>
			<div class="space-y-4">
				{#each endpoints as ep (ep.path)}
					<div class="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
						<span
							class="shrink-0 rounded-md bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-purple-300"
						>
							{ep.method}
						</span>
						<div>
							<code class="text-sm text-zinc-200">{ep.path}</code>
							<p class="mt-1 text-sm text-zinc-500">{ep.desc}</p>
						</div>
					</div>
				{/each}
			</div>
			<div class="mt-8 text-center">
				<a href="/docs" class="text-sm text-purple-400 transition-colors hover:text-purple-300">
					View full API reference &rarr;
				</a>
			</div>
		</div>
	</section>

	<!-- Pricing -->
	<section id="pricing" class="border-t border-zinc-800/50 px-6 py-20">
		<div class="mx-auto max-w-5xl">
			<h2 class="mb-4 text-center text-3xl font-bold">Pricing</h2>
			<p class="mx-auto mb-14 max-w-xl text-center text-zinc-400">
				Start free. Upgrade when you need more.
			</p>
			<div class="grid gap-6 md:grid-cols-4">
				{#each tiers as tier, i (tier.name)}
					<div
						class="rounded-xl border p-6 {i === 1
							? 'border-purple-500/50 bg-purple-500/5'
							: 'border-zinc-800 bg-zinc-900/50'}"
					>
						<h3 class="mb-1 font-semibold text-zinc-100">{tier.name}</h3>
						<div class="mb-4 text-3xl font-bold text-white">{tier.price}</div>
						<p class="mb-2 text-sm text-zinc-400">{tier.calls} requests</p>
						<p class="text-sm text-zinc-500">{tier.target}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="border-t border-zinc-800/50 px-6 py-20">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="mb-4 text-3xl font-bold">Ready to build?</h2>
			<p class="mb-8 text-zinc-400">
				Get your free API key and start querying 176 exercises with EMG data in minutes.
			</p>
			<a
				href="/docs"
				class="inline-block rounded-lg bg-purple-600 px-8 py-3 font-medium text-white transition-colors hover:bg-purple-500"
			>
				Get Started Free
			</a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-zinc-800/50 px-6 py-10">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<span class="text-sm text-zinc-500">Logmaxing</span>
			<div class="flex gap-6">
				<a href="/docs" class="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
					>API Docs</a
				>
				<a
					href="https://github.com/0xHenrik"
					class="text-sm text-zinc-500 transition-colors hover:text-zinc-300">GitHub</a
				>
			</div>
		</div>
	</footer>
</div>
