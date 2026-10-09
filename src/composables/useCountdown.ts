import { readonly, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';
import { toTimestamp } from '../core/time';
import { useTimerLifecycle } from './lifecycle';

export interface UseCountdownOptions {
	/** Date to count down to. Takes precedence over `duration`. */
	end?: MaybeRefOrGetter<Date | number | string | undefined>;
	/** Time to count down from, in ms. */
	duration?: MaybeRefOrGetter<number | undefined>;
	/** How often `remaining` is updated, in ms. Updates are aligned to the end time. Defaults to 1000. */
	precision?: MaybeRefOrGetter<number | undefined>;
	/** Start counting as soon as the component is mounted. Defaults to `true`. */
	autostart?: MaybeRefOrGetter<boolean | undefined>;
	onTick?: (remaining: number) => void;
	onFinish?: () => void;
	onStart?: () => void;
	onPause?: () => void;
	onReset?: () => void;
}

export interface UseCountdownReturn {
	/** Remaining time in ms, updated every `precision` ms while running. */
	remaining: Readonly<Ref<number>>;
	/** Remaining time in ms when the countdown was (re)set. */
	total: Readonly<Ref<number>>;
	isRunning: Readonly<Ref<boolean>>;
	isFinished: Readonly<Ref<boolean>>;
	/** Starts the countdown, or restarts it if it has finished. */
	start: () => void;
	pause: () => void;
	/** Continues a paused countdown. */
	resume: () => void;
	/** Stops the countdown and restores its initial time. */
	reset: () => void;
}

/**
 * Counts down to a date or for a duration, based on the clock rather than on timer ticks.
 *
 * With `duration`, pausing freezes the remaining time. With `end`, pausing only stops updates:
 * the date doesn't move, so `resume` jumps to the real remaining time.
 */
export function useCountdown (options: UseCountdownOptions = {}): UseCountdownReturn {
	const remaining = ref(0);
	const total = ref(0);
	const isRunning = ref(false);
	const isFinished = ref(false);

	let endTime = 0;
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	let lastTick: number | undefined;

	const getEnd = (): number | undefined => {
		const end = toValue(options.end);
		return end === undefined || end === null ? undefined : toTimestamp(end);
	};
	const getPrecision = () => Math.max(1, toValue(options.precision) ?? 1000);

	const initialRemaining = (): number => {
		const end = getEnd();
		if (end !== undefined) {
			return Number.isNaN(end) ? 0 : Math.max(0, end - Date.now());
		}
		return Math.max(0, toValue(options.duration) ?? 0);
	};

	const update = () => {
		clearTimeout(timeoutId);
		const precision = getPrecision();
		remaining.value = Math.max(0, endTime - Date.now());

		const tick = Math.ceil(remaining.value / precision);
		if (tick !== lastTick) {
			lastTick = tick;
			options.onTick?.(remaining.value);
		}

		if (remaining.value <= 0) {
			isRunning.value = false;
			isFinished.value = true;
			options.onFinish?.();
		} else {
			// Wake up when the displayed value changes
			timeoutId = setTimeout(update, remaining.value % precision || precision);
		}
	};

	const resetState = () => {
		clearTimeout(timeoutId);
		isRunning.value = false;
		isFinished.value = false;
		lastTick = undefined;
		total.value = remaining.value = initialRemaining();
	};

	const start = () => {
		if (isRunning.value) {
			return;
		}
		if (isFinished.value) {
			resetState();
		}
		const end = getEnd();
		endTime = end === undefined ? Date.now() + remaining.value : Number.isNaN(end) ? 0 : end;
		isRunning.value = true;
		options.onStart?.();
		update();
	};

	const pause = () => {
		if (!isRunning.value) {
			return;
		}
		clearTimeout(timeoutId);
		remaining.value = Math.max(0, endTime - Date.now());
		isRunning.value = false;
		options.onPause?.();
	};

	const resume = () => {
		if (!isFinished.value) {
			start();
		}
	};

	const reset = () => {
		resetState();
		options.onReset?.();
	};

	resetState();

	watch([ getEnd, () => toValue(options.duration) ], () => {
		const wasRunning = isRunning.value;
		resetState();
		if (wasRunning || (toValue(options.autostart) ?? true)) {
			start();
		}
	});

	useTimerLifecycle({
		autostart: () => toValue(options.autostart) ?? true,
		start,
		onVisible: () => {
			if (isRunning.value) {
				update();
			}
		},
		stop: () => clearTimeout(timeoutId)
	});

	return {
		remaining: readonly(remaining),
		total: readonly(total),
		isRunning: readonly(isRunning),
		isFinished: readonly(isFinished),
		start,
		pause,
		resume,
		reset
	};
}
