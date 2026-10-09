<template>
	<div class="example">
		<CircularTimeCountDown
			ref="timer"
			:duration="25 * 60 * 1000"
			:units="[ 'minutes', 'seconds' ]"
			:labels="{ minutes: 'min', seconds: 'sec' }"
			:autostart="false"
			:size="104"
			:stroke-width="9"
			stroke-linecap="round"
			:value-font-size="28"
			:label-font-size="12"
			:format-value="pad"
			@started="state = 'running'"
			@paused="state = 'paused'"
			@reset="state = 'idle'"
			@finished="state = 'finished'"
		/>
		<p class="status">
			{{ messages[state] }}
		</p>
		<div class="actions">
			<button
				v-if="state === 'running'"
				type="button"
				class="btn btn--sm"
				@click="timer?.pause()"
			>
				Pause
			</button>
			<button
				v-else
				type="button"
				class="btn btn--primary btn--sm"
				@click="state === 'paused' ? timer?.resume() : timer?.start()"
			>
				{{ state === 'paused' ? 'Resume' : 'Start focus' }}
			</button>
			<button
				type="button"
				class="btn btn--sm"
				:disabled="state === 'idle'"
				@click="timer?.reset()"
			>
				Reset
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { CircularTimeCountDown } from 'vue-circular-count-down-timer';

type State = 'idle' | 'running' | 'paused' | 'finished';

const timer = useTemplateRef('timer');
const state = ref<State>('idle');

const messages: Record<State, string> = {
	idle: 'Ready for 25 minutes of focus',
	running: 'Focus time',
	paused: 'Paused',
	finished: 'Time for a break!'
};

const pad = (value: number) => String(value).padStart(2, '0');
</script>

<style scoped>
.example {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}

.status {
	color: var(--text-muted);
	font-size: 13px;
}

.actions {
	display: flex;
	gap: 8px;
}
</style>
