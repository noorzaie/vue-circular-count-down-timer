<template>
	<CircularCountDownTimer
		:circles="circles"
		main-circle-id="seconds"
		:size="96"
		:format-value="pad"
	/>
</template>

<script setup lang="ts">
import { CircularCountDownTimer, type CircleConfig } from 'vue-circular-count-down-timer';

// Every time "seconds" completes a round, "minutes" moves one step, and so on
const circles: CircleConfig[] = [
	{ id: 'hours', steps: 24, label: 'hours' },
	{ id: 'minutes', steps: 60, value: 59, label: 'minutes', dependentCircles: [ 'hours' ] },
	{ id: 'seconds', steps: 60, value: 50, label: 'seconds', dependentCircles: [ 'minutes' ] }
];

const pad = (value: number) => String(value).padStart(2, '0');
</script>
