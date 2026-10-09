<template>
	<div class="field field--inline">
		<label
			:for="inputId"
			class="field__label"
		>{{ label }}</label>
		<div class="color">
			<input
				:id="inputId"
				class="color__input"
				type="color"
				:value="model ?? fallback"
				@input="model = ($event.target as HTMLInputElement).value"
			>
			<span class="color__value">{{ model ?? 'Theme' }}</span>
			<button
				v-if="model"
				type="button"
				class="color__clear"
				:aria-label="`Use the theme color for ${label.toLowerCase()}`"
				@click="model = undefined"
			>
				Reset
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

defineProps<{
	label: string;
	/** Color shown in the picker while the theme color is used */
	fallback: string;
}>();

const model = defineModel<string | undefined>({ required: true });
const inputId = useId();
</script>

<style scoped>
.color {
	display: flex;
	align-items: center;
	gap: 8px;
}

.color__input {
	width: 28px;
	height: 28px;
	padding: 0;
	border: 1px solid var(--border-strong);
	border-radius: 6px;
	background: none;
	cursor: pointer;
}

.color__input::-webkit-color-swatch-wrapper {
	padding: 2px;
}

.color__input::-webkit-color-swatch {
	border: 0;
	border-radius: 4px;
}

.color__value {
	min-width: 60px;
	color: var(--text-muted);
	font-family: var(--font-mono);
	font-size: 12px;
}

.color__clear {
	padding: 0;
	border: 0;
	background: none;
	color: var(--accent-text);
	font-size: 12px;
	cursor: pointer;
}
</style>
