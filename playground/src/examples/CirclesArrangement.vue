<template>
	<CircularCountDownTimer
		:circles="circles"
		main-circle-id="1"
		:interval="500"
		:size="72"
		:stroke-width="6"
		:container-classes="[ 'grid' ]"
	/>
</template>

<script setup lang="ts">
import { CircularCountDownTimer, type CircleConfig } from 'vue-circular-count-down-timer';

const circles: CircleConfig[] = [ 1, 2, 3, 4 ].map(id => ({
	id,
	steps: 10,
	label: `circle ${id}`,
	dependentCircles: id < 4 ? [ id + 1 ] : []
}));
</script>

<style scoped>
/* container-classes lets you lay the circles out however you like */
.grid {
	display: grid;
	grid-template-columns: repeat(2, auto);
}
</style>
