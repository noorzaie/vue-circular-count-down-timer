<template>
	<div class="field">
		<span
			:id="labelId"
			class="field__label"
		>{{ label }}</span>
		<div
			class="segmented"
			role="radiogroup"
			:aria-labelledby="labelId"
		>
			<button
				v-for="option in options"
				:key="option.value"
				type="button"
				role="radio"
				:aria-checked="model === option.value"
				:class="[ 'segmented__option', { 'segmented__option--active': model === option.value } ]"
				@click="model = option.value"
			>
				{{ option.label }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts" generic="T extends string">
import { useId } from 'vue';

defineProps<{
	label: string;
	options: { value: T; label: string }[];
}>();

const model = defineModel<T>({ required: true });
const labelId = useId();
</script>

<style scoped>
.segmented {
	display: flex;
	padding: 3px;
	border-radius: var(--radius-sm);
	background: var(--bg-subtle);
}

.segmented__option {
	flex: 1;
	min-width: 0;
	padding: 5px 8px;
	border: 0;
	border-radius: 6px;
	background: transparent;
	color: var(--text-muted);
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
	cursor: pointer;
	transition: background-color 0.15s, color 0.15s;
}

.segmented__option:hover {
	color: var(--text);
}

.segmented__option--active {
	background: var(--bg-elevated);
	color: var(--text);
	box-shadow: var(--shadow-sm);
}
</style>
