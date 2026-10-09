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

// A negative stepLength counts down
const circles: CircleConfig[] = [
	{ id: 'minutes', steps: 60, value: 20, stepLength: -1, label: 'minutes' },
	{ id: 'seconds', steps: 60, value: 30, stepLength: -1, label: 'seconds', dependentCircles: [ 'minutes' ] }
];

const pad = (value: number) => String(value).padStart(2, '0');
</script>
