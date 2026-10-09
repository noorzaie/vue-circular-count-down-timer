<template>
	<label class="field">
		<span class="field__row">
			<span class="field__label">{{ label }}</span>
			<span class="field__value">{{ model }}{{ unit }}</span>
		</span>
		<input
			v-model.number="model"
			class="field__range"
			type="range"
			:min="min"
			:max="max"
			:step="step"
		>
	</label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	label: string;
	min: number;
	max: number;
	step?: number;
	unit?: string;
}>(), { step: 1, unit: '' });

const model = defineModel<number>({ required: true });
</script>
