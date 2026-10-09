<template>
	<CircularCountDownTimer
		:circles="circles"
		main-circle-id="1"
		:size="120"
	/>
</template>

<script setup lang="ts">
import { CircularCountDownTimer, type CircleConfig } from 'vue-circular-count-down-timer';

const circles: CircleConfig[] = [
	{ id: '1', steps: 10, label: 'steps' }
];
</script>
