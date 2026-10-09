<template>
	<CircularTimeCountDown
		:duration="(2 * 3600 + 15 * 60) * 1000"
		:units="[ 'hours', 'minutes', 'seconds' ]"
		:labels="{ hours: '', minutes: '', seconds: '' }"
		:size="96"
		:stroke-width="4"
		stroke-linecap="round"
	>
		<template #value="{ value, unit }">
			<span class="value">
				<strong>{{ String(value).padStart(2, '0') }}</strong>
				<small>{{ abbreviations[unit] }}</small>
			</span>
		</template>
	</CircularTimeCountDown>
</template>

<script setup lang="ts">
import { CircularTimeCountDown, type TimeUnit } from 'vue-circular-count-down-timer';

// Labels are empty, so the unit is shown inside the circle by the value slot
const abbreviations: Record<TimeUnit, string> = { days: 'd', hours: 'h', minutes: 'm', seconds: 's' };
</script>

<style scoped>
.value {
	display: flex;
	align-items: baseline;
	gap: 2px;
}

.value strong {
	font-size: 26px;
	font-weight: 600;
}

.value small {
	color: var(--text-muted);
	font-size: 13px;
}
</style>
