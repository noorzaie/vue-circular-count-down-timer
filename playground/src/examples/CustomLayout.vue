<template>
	<div class="example">
		<CountDownCircle
			:value="Math.ceil(remaining / 1000)"
			:steps="total / 1000"
			:size="150"
			:stroke-width="6"
			stroke-linecap="round"
			direction="counterclockwise"
		>
			<template #value>
				<span class="time">{{ time.minutes }}:{{ String(time.seconds).padStart(2, '0') }}</span>
				<span class="hint">{{ isFinished ? 'done' : isRunning ? 'remaining' : 'paused' }}</span>
			</template>
		</CountDownCircle>
		<div
			class="bar"
			role="presentation"
		>
			<div
				class="bar__fill"
				:style="{ width: `${(remaining / total) * 100}%` }"
			/>
		</div>
		<div class="actions">
			<button
				type="button"
				class="btn btn--sm"
				@click="isRunning ? pause() : start()"
			>
				{{ isRunning ? 'Pause' : isFinished ? 'Restart' : 'Resume' }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CountDownCircle, splitTime, useCountdown } from 'vue-circular-count-down-timer';

// useCountdown gives you the timer logic; render it however you like
const { remaining, total, isRunning, isFinished, start, pause } = useCountdown({
	duration: 90 * 1000
});

const time = computed(() => splitTime(remaining.value, [ 'minutes', 'seconds' ]) as { minutes: number; seconds: number });
</script>

<style scoped>
.example {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14px;
}

.time {
	display: block;
	font-size: 34px;
	font-weight: 600;
	letter-spacing: -0.02em;
	text-align: center;
}

.hint {
	display: block;
	color: var(--text-muted);
	font-size: 12px;
	text-align: center;
}

.bar {
	width: 180px;
	height: 6px;
	overflow: hidden;
	border-radius: 999px;
	background: var(--bg-subtle);
}

.bar__fill {
	height: 100%;
	border-radius: inherit;
	background: var(--accent);
	transition: width 0.5s ease;
}

.actions {
	display: flex;
	gap: 8px;
}
</style>
