<template>
	<CircularCountDownTimer
		:circles="circles"
		main-circle-id="c"
		:interval="400"
		:size="96"
		:stroke-width="10"
		:value-font-size="24"
	/>
</template>

<script setup lang="ts">
import { CircularCountDownTimer, type CircleConfig } from 'vue-circular-count-down-timer';

// Shared options are set on the component; each circle can override any of them
const circles: CircleConfig[] = [
	{
		id: 'a',
		steps: 12,
		startValue: 1,
		value: 12,
		label: '1 to 12',
		strokeColor: '#12b886',
		underneathStrokeColor: 'rgb(18 184 134 / 15%)'
	},
	{
		id: 'b',
		steps: 10,
		label: 'reversed',
		strokeLinecap: 'round',
		direction: 'counterclockwise',
		strokeColor: '#f59f00',
		underneathStrokeColor: 'rgb(245 159 0 / 15%)',
		dependentCircles: [ 'a' ]
	},
	{
		id: 'c',
		steps: 10,
		label: 'label on top',
		labelPosition: 'top',
		strokeWidth: 4,
		strokeColor: '#e64980',
		fillColor: 'rgb(230 73 128 / 8%)',
		dependentCircles: [ 'b' ]
	}
];
</script>
