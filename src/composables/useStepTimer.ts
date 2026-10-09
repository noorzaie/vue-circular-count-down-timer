import { readonly, ref, watch, type Ref } from 'vue';
import { advanceCircle, createStepState, getValues, shouldStop, type StepState } from '../core/steps';
import type { CircleConfig, CircleId, CircleValues, StopConditions } from '../types';
import { useTimerLifecycle } from './lifecycle';

// Limits the work done in one tick after a long time in a background tab with a very short interval
const MAX_STEPS_PER_TICK = 100_000;

interface UseStepTimerOptions {
	circles: () => CircleConfig[];
	mainCircleId: () => CircleId;
	interval: () => number;
	stopConditions: () => StopConditions;
	autostart: () => boolean;
	onUpdate: (values: CircleValues) => void;
	onFinish: () => void;
	onStart: () => void;
	onPause: () => void;
	onReset: () => void;
}

export interface UseStepTimerReturn {
	state: Readonly<Ref<StepState>>;
	isRunning: Readonly<Ref<boolean>>;
	isFinished: Readonly<Ref<boolean>>;
	start: () => void;
	pause: () => void;
	resume: () => void;
	reset: () => void;
}

/**
 * Moves the main circle one step every `interval` ms. Steps are derived from the elapsed time,
 * so the timer doesn't drift and catches up after the browser throttled it in a background tab.
 */
export function useStepTimer (options: UseStepTimerOptions): UseStepTimerReturn {
	const state = ref<StepState>(createStepState(options.circles()));
	const isRunning = ref(false);
	const isFinished = ref(false);

	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	// Time at which step 0 started, shifted on pause/resume
	let anchor = 0;
	let appliedSteps = 0;
	let elapsedAtPause = 0;

	const getInterval = () => Math.max(1, options.interval());

	const schedule = () => {
		clearTimeout(timeoutId);
		const nextStepAt = anchor + (appliedSteps + 1) * getInterval();
		timeoutId = setTimeout(tick, Math.max(0, nextStepAt - Date.now()));
	};

	const tick = () => {
		const dueSteps = Math.min(
			Math.floor((Date.now() - anchor) / getInterval()),
			appliedSteps + MAX_STEPS_PER_TICK
		);
		const mainCircleId = String(options.mainCircleId());
		const stopConditions = options.stopConditions();
		let stopped = false;
		let changed = false;

		while (appliedSteps < dueSteps && !stopped) {
			advanceCircle(state.value, mainCircleId);
			appliedSteps++;
			changed = true;
			stopped = shouldStop(state.value, stopConditions);
		}

		if (changed) {
			options.onUpdate(getValues(state.value));
		}

		if (stopped) {
			clearTimeout(timeoutId);
			isRunning.value = false;
			isFinished.value = true;
			options.onFinish();
		} else if (isRunning.value) {
			schedule();
		}
	};

	const resetState = () => {
		clearTimeout(timeoutId);
		isRunning.value = false;
		isFinished.value = false;
		appliedSteps = 0;
		elapsedAtPause = 0;
		state.value = createStepState(options.circles());
	};

	const start = () => {
		if (isRunning.value) {
			return;
		}
		if (isFinished.value) {
			resetState();
		}
		anchor = Date.now() - elapsedAtPause;
		isRunning.value = true;
		options.onStart();
		schedule();
	};

	const pause = () => {
		if (!isRunning.value) {
			return;
		}
		clearTimeout(timeoutId);
		elapsedAtPause = Date.now() - anchor;
		isRunning.value = false;
		options.onPause();
	};

	const resume = () => {
		if (!isFinished.value) {
			start();
		}
	};

	const reset = () => {
		resetState();
		options.onReset();
	};

	// Also react to array mutations (push, splice, ...), but not to changes of nested circle options
	watch(options.circles, () => {
		const wasRunning = isRunning.value;
		resetState();
		if (wasRunning || options.autostart()) {
			start();
		}
	}, { deep: 1 });

	watch(options.interval, () => {
		// Keep the current step and start a fresh interval with the new length
		if (isRunning.value) {
			anchor = Date.now() - appliedSteps * getInterval();
			schedule();
		} else {
			elapsedAtPause = appliedSteps * getInterval();
		}
	});

	useTimerLifecycle({
		autostart: options.autostart,
		start,
		onVisible: () => {
			if (isRunning.value) {
				clearTimeout(timeoutId);
				tick();
			}
		},
		stop: () => clearTimeout(timeoutId)
	});

	return {
		state: readonly(state) as Readonly<Ref<StepState>>,
		isRunning: readonly(isRunning),
		isFinished: readonly(isFinished),
		start,
		pause,
		resume,
		reset
	};
}
