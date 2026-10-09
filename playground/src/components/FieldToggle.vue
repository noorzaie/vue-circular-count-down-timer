<template>
	<div class="field field--inline">
		<span
			:id="labelId"
			class="field__label"
		>{{ label }}</span>
		<button
			type="button"
			role="switch"
			:aria-checked="model"
			:aria-labelledby="labelId"
			:class="[ 'switch', { 'switch--on': model } ]"
			@click="model = !model"
		>
			<span class="switch__thumb" />
		</button>
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

defineProps<{ label: string }>();

const model = defineModel<boolean>({ required: true });
const labelId = useId();
</script>

<style scoped>
.switch {
	position: relative;
	flex-shrink: 0;
	width: 38px;
	height: 22px;
	padding: 0;
	border: 0;
	border-radius: 999px;
	background: var(--border-strong);
	cursor: pointer;
	transition: background-color 0.15s;
}

.switch--on {
	background: var(--accent);
}

.switch__thumb {
	position: absolute;
	top: 3px;
	left: 3px;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: #ffffff;
	box-shadow: 0 1px 2px rgb(0 0 0 / 20%);
	transition: transform 0.15s;
}

.switch--on .switch__thumb {
	transform: translateX(16px);
}
</style>
