<script lang="ts">
	import type { ExerciseListItem } from '$lib/server/api/exercises';

	interface ExerciseDetailData {
		id: number;
		name: string;
		muscles: {
			exerciseId: number;
			muscleId: number;
			activationType: string | null;
			weighting: number | null;
			muscle: { id: number; name: string; muscleGroup: string | null };
		}[];
		equipment: {
			exerciseId: number;
			equipmentId: number;
			equipment: { id: number; name: string };
		}[];
	}

	let searchQuery = $state('');
	let selectedMuscleGroup = $state('');
	let exercises = $state<ExerciseListItem[]>([]);
	let selectedExercise = $state<ExerciseDetailData | null>(null);
	let isLoading = $state(false);
	let showDetail = $state(false);

	const muscleGroups = ['Push', 'Pull', 'Legs', 'Core'];

	async function fetchExercises() {
		isLoading = true;
		const queryParts: string[] = [];

		if (searchQuery) queryParts.push(`search=${encodeURIComponent(searchQuery)}`);
		if (selectedMuscleGroup)
			queryParts.push(`muscleGroup=${encodeURIComponent(selectedMuscleGroup)}`);
		queryParts.push('limit=50');

		const res = await fetch(`/api/exercises?${queryParts.join('&')}`);
		exercises = await res.json();
		isLoading = false;
	}

	async function viewExercise(id: number) {
		const res = await fetch(`/api/exercises/${id}`);
		selectedExercise = await res.json();
		showDetail = true;
	}

	function closeDetail() {
		showDetail = false;
		selectedExercise = null;
	}

	// Debounced search
	let searchTimeout: ReturnType<typeof setTimeout>;
	function handleSearch(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		searchQuery = value;
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(fetchExercises, 300);
	}

	function handleMuscleGroupChange(e: Event) {
		selectedMuscleGroup = (e.target as HTMLSelectElement).value;
		fetchExercises();
	}

	function clearFilters() {
		searchQuery = '';
		selectedMuscleGroup = '';
		fetchExercises();
	}

	// Initial load
	$effect(() => {
		fetchExercises();
	});
</script>

<div class="min-h-screen bg-gray-900 text-gray-100">
	<div class="mx-auto max-w-4xl px-4 py-8">
		<h1 class="mb-8 text-3xl font-bold">Exercise Library</h1>

		<!-- Search and Filters -->
		<div class="mb-6 flex flex-col gap-4 sm:flex-row">
			<div class="flex-1">
				<input
					type="text"
					placeholder="Search exercises..."
					value={searchQuery}
					oninput={handleSearch}
					class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div class="flex gap-2">
				<select
					value={selectedMuscleGroup}
					onchange={handleMuscleGroupChange}
					class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">All Muscle Groups</option>
					{#each muscleGroups as group (group)}
						<option value={group}>{group}</option>
					{/each}
				</select>
				{#if searchQuery || selectedMuscleGroup}
					<button
						onclick={clearFilters}
						class="rounded-lg bg-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-600"
					>
						Clear
					</button>
				{/if}
			</div>
		</div>

		<!-- Results count -->
		<p class="mb-4 text-sm text-gray-400">
			{#if isLoading}
				Loading...
			{:else}
				{exercises.length} exercises found
			{/if}
		</p>

		<!-- Exercise List -->
		<div class="space-y-2">
			{#each exercises as exercise (exercise.id)}
				<button
					onclick={() => viewExercise(exercise.id)}
					class="hover:bg-gray-750 flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4 text-left transition-colors hover:border-gray-600"
				>
					<div>
						<h3 class="font-medium text-gray-100">{exercise.name}</h3>
						<p class="text-sm text-gray-400">
							{exercise.primaryMuscle}
							{#if exercise.muscleGroup}
								<span class="text-gray-500">({exercise.muscleGroup})</span>
							{/if}
						</p>
					</div>
					<svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>
			{/each}
		</div>

		{#if exercises.length === 0 && !isLoading}
			<div class="py-12 text-center text-gray-500">
				No exercises found. Try adjusting your search or filters.
			</div>
		{/if}
	</div>

	<!-- Exercise Detail Modal -->
	{#if showDetail && selectedExercise}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
			onclick={closeDetail}
			onkeydown={(e) => e.key === 'Escape' && closeDetail()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="exercise-detail-title"
			tabindex="-1"
		>
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
			<div
				class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-gray-800 p-6"
				onclick={(e) => e.stopPropagation()}
				role="document"
			>
				<div class="mb-4 flex items-start justify-between">
					<h2 id="exercise-detail-title" class="text-2xl font-bold text-gray-100">
						{selectedExercise.name}
					</h2>
					<button
						onclick={closeDetail}
						aria-label="Close exercise details"
						class="rounded-lg p-1 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>

				<!-- Muscle Activations -->
				<div class="mb-6">
					<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
						Muscle Activation
					</h3>
					<div class="space-y-2">
						{#each selectedExercise.muscles as m (m.muscleId)}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<span
										class={`inline-block h-2 w-2 rounded-full ${m.activationType === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}`}
									></span>
									<span class="text-gray-200">{m.muscle.name}</span>
									<span class="text-xs text-gray-500">({m.muscle.muscleGroup})</span>
								</div>
								<div class="flex items-center gap-2">
									<div class="h-2 w-24 overflow-hidden rounded-full bg-gray-700">
										<div
											class={`h-full ${m.activationType === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}`}
											style="width: {(m.weighting ?? 0) * 100}%"
										></div>
									</div>
									<span class="w-12 text-right text-sm text-gray-400">
										{Math.round((m.weighting ?? 0) * 100)}%
									</span>
								</div>
							</div>
						{/each}
					</div>
					<div class="mt-3 flex gap-4 text-xs text-gray-500">
						<span class="flex items-center gap-1">
							<span class="inline-block h-2 w-2 rounded-full bg-blue-500"></span> Primary
						</span>
						<span class="flex items-center gap-1">
							<span class="inline-block h-2 w-2 rounded-full bg-gray-500"></span> Secondary
						</span>
					</div>
				</div>

				<!-- Equipment -->
				<div>
					<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
						Equipment
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each selectedExercise.equipment as e (e.equipmentId)}
							<span class="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
								{e.equipment.name}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
