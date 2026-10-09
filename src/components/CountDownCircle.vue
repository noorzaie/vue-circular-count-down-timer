<template>
	<div
		ref="container"
		:class="[ 'circle__container', `circle__container--label-${labelPosition}` ]"
		:style="containerStyle"
	>
		<div
			class="circle__circle"
			:style="{ width: `${circleSize}px`, height: `${circleSize}px` }"
		>
			<div
				v-if="showValue"
				class="circle__value"
			>
				<slot
					name="value"
					:value="value"
					:formatted-value="formattedValue"
					:steps="steps"
				>
					{{ formattedValue }}
				</slot>
			</div>
			<svg
				:width="circleSize"
				:height="circleSize"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				focusable="false"
			>
				<circle
					class="circle__track"
					:r="radius"
					:cx="center"
					:cy="center"
					:stroke-width="strokeWidth"
				/>
				<circle
					class="circle__progress circle_animation"
					:transform="progressTransform"
					:style="{ strokeDasharray: circumference, strokeDashoffset, opacity: progress > 0 ? 1 : 0 }"
					:r="radius"
					:cx="center"
					:cy="center"
					:stroke-width="strokeWidth"
					:stroke-linecap="strokeLinecap"
				/>
			</svg>
		</div>
		<div
			v-if="label || $slots.label"
			ref="labelElement"
			class="circle__label"
		>
			<slot
				name="label"
				:label="label"
				:value="value"
			>
				{{ label }}
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import type { CircleAppearance } from '../types';

defineOptions({ name: 'CountDownCircle' });

export interface CountDownCircleProps extends CircleAppearance {
	value?: number;
	/** Number of values in the circle; the circle is full at `value === steps`. */
	steps?: number;
	label?: string;
}

const props = withDefaults(defineProps<CountDownCircleProps>(), {
	value: 0,
	steps: 60,
	label: '',
	size: 0,
	strokeWidth: 10,
	labelPosition: 'bottom',
	showValue: true,
	strokeLinecap: 'butt',
	direction: 'clockwise'
});

defineSlots<{
	value?: (props: { value: number; formattedValue: string | number; steps: number }) => unknown;
	label?: (props: { label: string; value: number }) => unknown;
}>();

const container = useTemplateRef<HTMLElement>('container');
const labelElement = useTemplateRef<HTMLElement>('labelElement');

// With `size: 0` the circle fills the height of its parent, minus the label
const measuredSize = ref(0);
let resizeObserver: ResizeObserver | undefined;

const measure = () => {
	const parent = container.value?.parentElement;
	if (parent) {
		measuredSize.value = Math.max(0, parent.clientHeight - (labelElement.value?.offsetHeight ?? 0));
	}
};

onMounted(() => {
	measure();
	const parent = container.value?.parentElement;
	if (parent && typeof ResizeObserver !== 'undefined') {
		resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(parent);
		if (labelElement.value) {
			resizeObserver.observe(labelElement.value);
		}
	}
});

onBeforeUnmount(() => resizeObserver?.disconnect());

const circleSize = computed(() => props.size > 0 ? props.size : measuredSize.value);
const center = computed(() => circleSize.value / 2);
const radius = computed(() => Math.max(0, (circleSize.value - props.strokeWidth) / 2));
const circumference = computed(() => 2 * Math.PI * radius.value);
const progress = computed(() => props.steps > 0 ? Math.min(1, Math.max(0, props.value / props.steps)) : 0);
const strokeDashoffset = computed(() => circumference.value * (1 - progress.value));
const formattedValue = computed(() => props.formatValue ? props.formatValue(props.value) : props.value);

// Start at 12 o'clock; mirror horizontally to fill counterclockwise
const progressTransform = computed(() => {
	const c = center.value;
	return props.direction === 'counterclockwise' ?
		`translate(${c} ${c}) scale(-1 1) rotate(-90) translate(${-c} ${-c})` :
		`rotate(-90 ${c} ${c})`;
});

// Props override the theme's CSS custom properties
const containerStyle = computed(() => {
	const style: Record<string, string> = { width: `${circleSize.value}px` };
	if (props.strokeColor) {
		style['--cdt-stroke-color'] = props.strokeColor;
	}
	if (props.underneathStrokeColor) {
		style['--cdt-underneath-stroke-color'] = props.underneathStrokeColor;
	}
	if (props.fillColor) {
		style['--cdt-fill-color'] = props.fillColor;
	}
	if (props.valueFontSize !== undefined) {
		style['--cdt-value-font-size'] = `${props.valueFontSize}px`;
	}
	if (props.labelFontSize !== undefined) {
		style['--cdt-label-font-size'] = `${props.labelFontSize}px`;
	}
	return style;
});
</script>

<style scoped>
	.circle__container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.circle__container--label-top {
		flex-direction: column-reverse;
	}

	.circle__circle {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		font-size: var(--cdt-value-font-size, 20px);
		color: var(--cdt-value-color, inherit);
	}

	.circle__value {
		position: absolute;
		font-variant-numeric: tabular-nums;
	}

	.circle__label {
		font-size: var(--cdt-label-font-size, 15px);
		color: var(--cdt-label-color, inherit);
	}

	.circle__track {
		stroke: var(--cdt-underneath-stroke-color, #eee);
		fill: var(--cdt-fill-color, #ffffff);
	}

	.circle__progress {
		stroke: var(--cdt-stroke-color, #9d989b);
		fill: transparent;
	}

	circle {
		transition: all var(--cdt-transition-duration, 0.5s) ease;
	}
</style>
