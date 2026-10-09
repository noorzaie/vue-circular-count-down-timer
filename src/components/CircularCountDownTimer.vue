<template>
	<div
		:class="[ 'circles__container', ...containerClasses ]"
		role="timer"
		:aria-label="accessibleLabel"
	>
		<div
			v-for="circle in circles"
			:key="circle.id"
			:class="[ 'circle__item', ...(circle.classList ?? circleClasses) ]"
		>
			<CountDownCircle
				v-bind="mergeAppearance(props, circle)"
				:value="getValue(circle)"
				:steps="circle.steps"
				:label="circle.label"
			>
				<template
					v-if="$slots.value"
					#value="slotProps"
				>
					<slot
						name="value"
						v-bind="slotProps"
						:circle="circle"
					/>
				</template>
				<template
					v-if="$slots.label"
					#label="slotProps"
				>
					<slot
						name="label"
						v-bind="slotProps"
						:circle="circle"
					/>
				</template>
			</CountDownCircle>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CountDownCircle from './CountDownCircle.vue';
import { formatValue, mergeAppearance } from '../core/appearance';
import { useStepTimer } from '../composables/useStepTimer';
import type { CircleAppearance, CircleConfig, CircleId, CircleValues, StopConditions } from '../types';

defineOptions({ name: 'CircularCountDownTimer' });

export interface CircularCountDownTimerProps extends CircleAppearance {
	/** Circles configuration. */
	circles?: CircleConfig[];
	/** Id of the circle that moves on every step. */
	mainCircleId: CircleId;
	/** Time between steps in ms. */
	interval?: number;
	/** Circle values (by circle id) at which the timer stops. */
	stopConditions?: StopConditions;
	/** Emit an `update` event on every step. */
	triggerUpdate?: boolean;
	/** Start counting as soon as the component is mounted. */
	autostart?: boolean;
	containerClasses?: string[];
	circleClasses?: string[];
	/** Accessible name of the timer. Defaults to the values and labels of the circles. */
	ariaLabel?: string;
}

const props = withDefaults(defineProps<CircularCountDownTimerProps>(), {
	circles: () => [],
	interval: 1000,
	stopConditions: () => ({}),
	triggerUpdate: true,
	autostart: true,
	containerClasses: () => [],
	circleClasses: () => [],
	size: 0,
	strokeWidth: 10,
	labelPosition: 'bottom',
	showValue: true,
	strokeLinecap: 'butt',
	direction: 'clockwise'
});

const emit = defineEmits<{
	/** Circle values after each step. */
	update: [ values: CircleValues ];
	/** The stop conditions were reached. */
	finished: [];
	started: [];
	paused: [];
	reset: [];
}>();

defineSlots<{
	value?: (props: { value: number; formattedValue: string | number; steps: number; circle: CircleConfig }) => unknown;
	label?: (props: { label: string; value: number; circle: CircleConfig }) => unknown;
}>();

const { state, isRunning, isFinished, start, pause, resume, reset } = useStepTimer({
	circles: () => props.circles,
	mainCircleId: () => props.mainCircleId,
	interval: () => props.interval,
	stopConditions: () => props.stopConditions,
	autostart: () => props.autostart,
	onUpdate: (values) => {
		if (props.triggerUpdate) {
			emit('update', values);
		}
	},
	onFinish: () => emit('finished'),
	onStart: () => emit('started'),
	onPause: () => emit('paused'),
	onReset: () => emit('reset')
});

const getValue = (circle: CircleConfig) => state.value[String(circle.id)]?.value ?? circle.value ?? 0;

const values = computed<CircleValues>(() => Object.fromEntries(
	props.circles.map(circle => [ String(circle.id), getValue(circle) ])
));

const accessibleLabel = computed(() => props.ariaLabel ?? props.circles
	.map((circle) => {
		const value = formatValue(getValue(circle), circle.formatValue ?? props.formatValue);
		return circle.label ? `${value} ${circle.label}` : value;
	})
	.join(', '));

defineExpose({
	/** Starts the timer, or restarts it if it has finished. */
	start,
	pause,
	/** Continues a paused timer. */
	resume,
	/** Stops the timer and restores the initial values. */
	reset,
	isRunning,
	isFinished,
	values
});
</script>

<style scoped>
	.circles__container {
		display: flex;
		flex-direction: row;
	}

	.circle__item {
		margin: var(--cdt-circle-margin, 5px);
		height: 100%;
	}
</style>
