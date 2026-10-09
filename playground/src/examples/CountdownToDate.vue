<template>
	<div class="example">
		<CircularTimeCountDown
			:end="newYear"
			:size="84"
			:stroke-width="7"
			stroke-linecap="round"
			:value-font-size="22"
			:label-font-size="12"
			:format-value="pad"
			:container-classes="[ 'wrap' ]"
		/>
		<p class="caption">
			until January 1, {{ year }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { CircularTimeCountDown } from 'vue-circular-count-down-timer';

const year = new Date().getFullYear() + 1;
const newYear = new Date(year, 0, 1);

const pad = (value: number) => String(value).padStart(2, '0');
</script>

<style scoped>
.example {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.wrap {
	flex-wrap: wrap;
	justify-content: center;
}

.caption {
	color: var(--text-muted);
	font-size: 13px;
}
</style>
