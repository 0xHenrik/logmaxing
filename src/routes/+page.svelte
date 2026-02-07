<script lang="ts">
	let waitlistEmail = $state('');
	let waitlistStatus = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let waitlistMessage = $state('');

	async function submitWaitlist(e: SubmitEvent) {
		e.preventDefault();
		if (!waitlistEmail.trim()) return;

		waitlistStatus = 'loading';
		try {
			const res = await fetch('/api/waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: waitlistEmail.trim() })
			});
			const data = await res.json();

			if (res.ok) {
				waitlistStatus = 'success';
				waitlistMessage = data.message;
				waitlistEmail = '';
			} else {
				waitlistStatus = 'error';
				waitlistMessage = data.error;
			}
		} catch {
			waitlistStatus = 'error';
			waitlistMessage = 'Something went wrong. Please try again.';
		}
	}

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

	const faqs = [
		{
			q: 'What is an exercise API?',
			a: 'An exercise API is a programmatic interface that provides structured data about exercises, muscle groups, and workout science. Developers use exercise APIs to build fitness apps without manually collecting and structuring training data.'
		},
		{
			q: 'What data does the Logmaxing API provide?',
			a: 'We provide 176 exercises with EMG-backed muscle activation percentages, volume landmarks (MEV/MAV/MRV) for 19 muscle groups, biomechanics classification, equipment requirements, and difficulty levels.'
		},
		{
			q: 'Is there a free tier?',
			a: 'Yes. The free tier includes 100 API requests per day, perfect for hobby projects and evaluation. Paid tiers start at $29/month for 5,000 requests.'
		},
		{
			q: 'How is this different from other exercise APIs?',
			a: 'Logmaxing is the only exercise API with EMG-backed muscle activation data and volume landmarks (MEV/MAV/MRV). Other exercise APIs like ExerciseDB and API Ninjas provide basic exercise lists without periodization science or muscle activation percentages.'
		}
	];

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				name: 'Logmaxing',
				url: 'https://logmaxing.tech',
				sameAs: ['https://github.com/0xHenrik'],
				description: 'Exercise science data API for fitness application developers'
			},
			{
				'@type': 'WebAPI',
				name: 'Logmaxing Training Science API',
				description:
					'RESTful API providing an exercise database with EMG muscle activation data, volume landmarks (MEV/MAV/MRV), and biomechanics classification',
				documentation: 'https://logmaxing.tech/docs',
				provider: { '@type': 'Organization', name: 'Logmaxing' }
			},
			{
				'@type': 'SoftwareApplication',
				name: 'Logmaxing Exercise API',
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'Web',
				offers: {
					'@type': 'Offer',
					price: '0',
					priceCurrency: 'USD',
					description: 'Free tier with 100 requests per day'
				}
			},
			{
				'@type': 'FAQPage',
				mainEntity: faqs.map((faq) => ({
					'@type': 'Question',
					name: faq.q,
					acceptedAnswer: { '@type': 'Answer', text: faq.a }
				}))
			}
		]
	});
</script>

<svelte:head>
	<title>Exercise API with EMG Data & Volume Landmarks | Logmaxing</title>
	<meta
		name="description"
		content="RESTful exercise API for fitness apps. 176 exercises with EMG muscle activation data, MEV/MAV/MRV volume landmarks, biomechanics filters. Free tier available."
	/>

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://logmaxing.tech" />
	<meta property="og:title" content="Exercise API with EMG Data & Volume Landmarks" />
	<meta
		property="og:description"
		content="RESTful exercise API for fitness apps. 176 exercises with EMG muscle activation data, MEV/MAV/MRV volume landmarks, biomechanics filters. Free tier available."
	/>
	<meta property="og:image" content="https://logmaxing.tech/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Exercise API with EMG Data & Volume Landmarks" />
	<meta
		name="twitter:description"
		content="RESTful exercise API for fitness apps. 176 exercises with EMG muscle activation data, MEV/MAV/MRV volume landmarks, biomechanics filters. Free tier available."
	/>
	<meta name="twitter:image" content="https://logmaxing.tech/og-image.png" />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100">
	<header>
		<nav class="border-b border-zinc-800/50" aria-label="Main navigation">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<a href="/" class="text-xl font-bold tracking-tight">
					<span class="text-purple-400">log</span>maxing
				</a>
				<div class="flex items-center gap-6">
					<a href="/docs" class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
						>Docs</a
					>
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
	</header>

	<main id="main-content">
		<!-- Hero -->
		<section class="px-6 pt-24 pb-20" aria-labelledby="hero-heading">
			<div class="mx-auto max-w-4xl text-center">
				<div
					class="mb-6 inline-block rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300"
				>
					Now in beta — free tier available
				</div>
				<h1
					id="hero-heading"
					class="mb-6 text-5xl leading-tight font-bold tracking-tight md:text-6xl"
				>
					Exercise & Workout
					<span class="text-purple-400">API</span>
				</h1>
				<p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400">
					The first public exercise API with EMG-backed muscle activation data. Query 176 exercises,
					volume landmarks (MEV/MAV/MRV), and biomechanics — built for fitness app developers.
				</p>
				<div class="flex items-center justify-center gap-4">
					<a
						href="/docs"
						class="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-500"
					>
						Get API Key Free
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

		<!-- Stats -->
		<section class="border-t border-zinc-800/50 px-6 py-12" aria-label="API statistics">
			<div class="mx-auto max-w-4xl">
				<div class="grid gap-8 text-center md:grid-cols-3">
					<div>
						<div class="text-4xl font-bold text-purple-400">176</div>
						<div class="mt-2 text-sm text-zinc-400">Exercises with EMG data</div>
					</div>
					<div>
						<div class="text-4xl font-bold text-purple-400">19</div>
						<div class="mt-2 text-sm text-zinc-400">Muscle groups tracked</div>
					</div>
					<div>
						<div class="text-4xl font-bold text-purple-400">100+</div>
						<div class="mt-2 text-sm text-zinc-400">Free API calls daily</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Code Example -->
		<section class="px-6 pb-20" aria-label="API code example">
			<div class="mx-auto max-w-3xl">
				<div class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
					<div class="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
						<div class="h-3 w-3 rounded-full bg-zinc-700" aria-hidden="true"></div>
						<div class="h-3 w-3 rounded-full bg-zinc-700" aria-hidden="true"></div>
						<div class="h-3 w-3 rounded-full bg-zinc-700" aria-hidden="true"></div>
						<span class="ml-2 text-xs text-zinc-400">Terminal</span>
					</div>
					<div class="p-6">
						<pre class="text-sm leading-relaxed"><code
								><span class="text-zinc-400">$</span> <span class="text-purple-300">curl</span
								> <span class="text-zinc-400">-H</span> <span class="text-green-300"
									>"X-API-Key: lmx_your_key"</span
								> \
  <span class="text-zinc-300"
									>https://logmaxing.tech/api/exercises?movementPattern=hip_hinge&difficulty=beginner</span
								>

<span class="text-zinc-400">// Response</span>
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
		<section class="border-t border-zinc-800/50 px-6 py-20" aria-labelledby="features-heading">
			<div class="mx-auto max-w-6xl">
				<h2 id="features-heading" class="mb-4 text-center text-3xl font-bold">
					Why Developers Choose This Exercise API
				</h2>
				<p class="mx-auto mb-14 max-w-xl text-center text-zinc-400">
					Exercise science data you'd spend months collecting, structured and ready to query via
					REST API.
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
		<section
			id="endpoints"
			class="border-t border-zinc-800/50 px-6 py-20"
			aria-labelledby="endpoints-heading"
		>
			<div class="mx-auto max-w-4xl">
				<h2 id="endpoints-heading" class="mb-4 text-center text-3xl font-bold">
					REST API Endpoints
				</h2>
				<p class="mx-auto mb-14 max-w-xl text-center text-zinc-400">
					RESTful JSON workout API. API key auth via header. That's it.
				</p>
				<div class="space-y-4">
					{#each endpoints as ep (ep.path)}
						<div
							class="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
						>
							<span
								class="shrink-0 rounded-md bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-purple-300"
							>
								{ep.method}
							</span>
							<div>
								<code class="text-sm text-zinc-200">{ep.path}</code>
								<p class="mt-1 text-sm text-zinc-400">{ep.desc}</p>
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
		<section
			id="pricing"
			class="border-t border-zinc-800/50 px-6 py-20"
			aria-labelledby="pricing-heading"
		>
			<div class="mx-auto max-w-5xl">
				<h2 id="pricing-heading" class="mb-4 text-center text-3xl font-bold">Pricing</h2>
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
							<p class="text-sm text-zinc-400">{tier.target}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- FAQ -->
		<section class="border-t border-zinc-800/50 px-6 py-20" aria-labelledby="faq-heading">
			<div class="mx-auto max-w-3xl">
				<h2 id="faq-heading" class="mb-12 text-center text-3xl font-bold">
					Frequently Asked Questions
				</h2>
				<div class="space-y-6">
					{#each faqs as faq (faq.q)}
						<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
							<h3 class="mb-2 text-lg font-semibold text-zinc-100">{faq.q}</h3>
							<p class="leading-relaxed text-zinc-400">{faq.a}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- CTA / Waitlist -->
		<section
			id="waitlist"
			class="border-t border-zinc-800/50 px-6 py-20"
			aria-label="Join the waitlist"
		>
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="mb-4 text-3xl font-bold">Get early access</h2>
				<p class="mb-8 text-zinc-400">
					Join the waitlist to get notified when the developer dashboard launches. Early subscribers
					get priority access and extended free tier limits.
				</p>

				{#if waitlistStatus === 'success'}
					<div class="rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-4">
						<p class="font-medium text-green-300">{waitlistMessage}</p>
						<p class="mt-1 text-sm text-green-400/70">We'll be in touch soon.</p>
					</div>
				{:else}
					<form onsubmit={submitWaitlist} class="mx-auto flex max-w-md gap-3">
						<input
							type="email"
							bind:value={waitlistEmail}
							placeholder="you@example.com"
							required
							disabled={waitlistStatus === 'loading'}
							class="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none disabled:opacity-50"
						/>
						<button
							type="submit"
							disabled={waitlistStatus === 'loading'}
							class="shrink-0 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
						>
							{waitlistStatus === 'loading' ? 'Joining...' : 'Join Waitlist'}
						</button>
					</form>
					{#if waitlistStatus === 'error'}
						<p class="mt-3 text-sm text-red-400">{waitlistMessage}</p>
					{/if}
					<p class="mt-4 text-xs text-zinc-500">No spam. Only product updates.</p>
				{/if}
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-zinc-800/50 px-6 py-10">
		<div class="mx-auto max-w-6xl">
			<div class="grid gap-8 md:grid-cols-4">
				<div>
					<h3 class="mb-3 text-sm font-semibold text-zinc-100">Product</h3>
					<ul class="space-y-2">
						<li>
							<a href="/docs" class="text-sm text-zinc-400 transition-colors hover:text-zinc-300"
								>API Documentation</a
							>
						</li>
						<li>
							<a href="#pricing" class="text-sm text-zinc-400 transition-colors hover:text-zinc-300"
								>Pricing</a
							>
						</li>
						<li>
							<a
								href="#endpoints"
								class="text-sm text-zinc-400 transition-colors hover:text-zinc-300">Endpoints</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-3 text-sm font-semibold text-zinc-100">Resources</h3>
					<ul class="space-y-2">
						<li>
							<a href="/docs" class="text-sm text-zinc-400 transition-colors hover:text-zinc-300"
								>Getting Started</a
							>
						</li>
						<li>
							<a href="/docs" class="text-sm text-zinc-400 transition-colors hover:text-zinc-300"
								>API Reference</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-3 text-sm font-semibold text-zinc-100">Company</h3>
					<ul class="space-y-2">
						<li>
							<a
								href="https://github.com/0xHenrik"
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm text-zinc-400 transition-colors hover:text-zinc-300">GitHub</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-3 text-sm font-semibold text-zinc-100">Legal</h3>
					<p class="text-sm text-zinc-400">Coming soon</p>
				</div>
			</div>

			<div class="mt-8 border-t border-zinc-800 pt-8 text-center">
				<p class="text-sm text-zinc-400">&copy; 2026 Logmaxing. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>

<!-- eslint-disable svelte/no-at-html-tags -->
{@html '<' + 'script type="application/ld+json">' + jsonLd + '</' + 'script>'}
