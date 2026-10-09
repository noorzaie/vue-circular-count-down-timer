<template>
	<div class="example">
		<CircularCountDownTimer
			ref="timer"
			:circles="circles"
			main-circle-id="seconds"
			:stop-conditions="{ minutes: 1, seconds: 5 }"
			:size="96"
			:format-value="pad"
			@started="finished = false"
			@finished="finished = true"
		/>
		<p class="status">
			<template v-if="finished">
				Stopped at 01:05
				<button
					type="button"
					class="btn btn--sm"
					@click="timer?.start()"
				>
					Run again
				</button>
			</template>
			<template v-else>
				Stops at 01:05
			</template>
		</p>
	</div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { CircularCountDownTimer, type CircleConfig } from 'vue-circular-count-down-timer';

const timer = useTemplateRef('timer');
const finished = ref(false);

const circles: CircleConfig[] = [
	{ id: 'minutes', steps: 60, label: 'minutes' },
	{ id: 'seconds', steps: 60, value: 55, label: 'seconds', dependentCircles: [ 'minutes' ] }
];

const pad = (value: number) => String(value).padStart(2, '0');
</script>

<style scoped>
.example {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.status {
	display: flex;
	align-items: center;
	gap: 10px;
	min-height: 32px;
	color: var(--text-muted);
	font-size: 13px;
}
</style>
