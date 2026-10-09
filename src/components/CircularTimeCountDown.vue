<template>
	<div
		:class="[ 'circles__container', ...containerClasses ]"
		role="timer"
		:aria-label="accessibleLabel"
	>
		<div
			v-for="circle in unitCircles"
			:key="circle.unit"
			:class="[ 'circle__item', ...(circle.classList ?? circleClasses) ]"
		>
			<CountDownCircle
				v-bind="circle.appearance"
				:value="circle.value"
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
						:unit="circle.unit"
					/>
				</template>
				<template
					v-if="$slots.label"
					#label="slotProps"
				>
					<slot
						name="label"
						v-bind="slotProps"
						:unit="circle.unit"
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
import { normalizeUnits, splitTime, TIME_UNITS, UNIT_MS } from '../core/time';
import { useCountdown } from '../composables/useCountdown';
import type { CircleAppearance, TimeParts, TimeUnit, TimeUnitCircleOptions, TimeUpdate } from '../types';

defineOptions({ name: 'CircularTimeCountDown' });

export interface CircularTimeCountDownProps extends CircleAppearance {
	/** Date to count down to. Takes precedence over `duration`. */
	end?: Date | number | string;
	/** Time to count down from, in ms. */
	duration?: number;
	/** Units to show, from largest to smallest. The largest unit holds everything above it. */
	units?: TimeUnit[];
	/** Labels of the units, e.g. for translations. */
	labels?: Partial<Record<TimeUnit, string>>;
	/** Options of the circle of each unit. */
	circleOptions?: Partial<Record<TimeUnit, TimeUnitCircleOptions>>;
	/** Start counting as soon as the component is mounted. */
	autostart?: boolean;
	containerClasses?: string[];
	circleClasses?: string[];
	/** Accessible name of the timer. Defaults to the values and labels of the circles. */
	ariaLabel?: string;
}

const props = withDefaults(defineProps<CircularTimeCountDownProps>(), {
	units: () => [ ...TIME_UNITS ],
	labels: () => ({}),
	circleOptions: () => ({}),
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
	/** Remaining time, split into the units, every time the smallest unit changes. */
	update: [ time: TimeUpdate ];
	finished: [];
	started: [];
	paused: [];
	reset: [];
}>();

defineSlots<{
	value?: (props: { value: number; formattedValue: string | number; steps: number; unit: TimeUnit }) => unknown;
	label?: (props: { label: string; value: number; unit: TimeUnit }) => unknown;
}>();

const NATURAL_STEPS: Record<TimeUnit, number> = { days: 0, hours: 24, minutes: 60, seconds: 60 };

const units = computed(() => normalizeUnits(props.units));

const { remaining, total, isRunning, isFinished, start, pause, resume, reset } = useCountdown({
	end: () => props.end,
	duration: () => props.duration,
	precision: () => UNIT_MS[units.value[units.value.length - 1]!],
	autostart: () => props.autostart,
	onTick: (ms) => emit('update', { ...splitTime(ms, units.value), remaining: ms }),
	onFinish: () => emit('finished'),
	onStart: () => emit('started'),
	onPause: () => emit('paused'),
	onReset: () => emit('reset')
});

const parts = computed<TimeParts>(() => splitTime(remaining.value, units.value));
const initialParts = computed<TimeParts>(() => splitTime(total.value, units.value));

const unitCircles = computed(() => units.value.map((unit, index) => {
	const options = props.circleOptions[unit] ?? {};
	// The largest unit starts full, the others use their natural range
	const steps = options.steps ?? (index === 0 ? Math.max(1, initialParts.value[unit] ?? 0) : NATURAL_STEPS[unit]);
	return {
		unit,
		value: parts.value[unit] ?? 0,
		steps,
		label: options.label ?? props.labels[unit] ?? unit,
		classList: options.classList,
		appearance: mergeAppearance(props, options)
	};
}));

const accessibleLabel = computed(() => props.ariaLabel ?? unitCircles.value
	.map(circle => `${formatValue(circle.value, circle.appearance.formatValue)} ${circle.label}`)
	.join(', '));

defineExpose({
	/** Starts the countdown, or restarts it if it has finished. */
	start,
	pause,
	/** Continues a paused countdown. */
	resume,
	/** Stops the countdown and restores its initial time. */
	reset,
	isRunning,
	isFinished,
	/** Remaining time in ms. */
	remaining
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
