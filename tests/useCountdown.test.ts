import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, effectScope, h, nextTick, ref, type EffectScope } from 'vue';
import { mount } from '@vue/test-utils';
import { useCountdown, type UseCountdownOptions, type UseCountdownReturn } from '../src/composables/useCountdown';

const NOW = Date.UTC(2030, 0, 1, 0, 0, 0);

let scope: EffectScope | undefined;

/** Runs the composable outside of a component, in an effect scope. */
const inScope = (options: UseCountdownOptions): UseCountdownReturn => {
	scope = effectScope();
	return scope.run(() => useCountdown(options))!;
};

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(NOW);
});

afterEach(() => {
	scope?.stop();
	scope = undefined;
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe('useCountdown in a component', () => {
	const mountCountdown = (options: UseCountdownOptions) => {
		let countdown!: UseCountdownReturn;
		const wrapper = mount(defineComponent({
			setup () {
				countdown = useCountdown(options);
				return () => h('span', String(countdown.remaining.value));
			}
		}));
		return { wrapper, countdown };
	};

	it('counts down a duration from mount', async () => {
		const { wrapper, countdown } = mountCountdown({ duration: 3_000 });
		expect(countdown.isRunning.value).toBe(true);
		expect(wrapper.text()).toBe('3000');

		vi.advanceTimersByTime(1_000);
		await nextTick();
		expect(wrapper.text()).toBe('2000');
	});

	it('stops calling onTick after unmount', () => {
		const onTick = vi.fn();
		const { wrapper } = mountCountdown({ duration: 5_000, onTick });
		expect(onTick).toHaveBeenCalledTimes(1);
		wrapper.unmount();
		vi.advanceTimersByTime(10_000);
		expect(onTick).toHaveBeenCalledTimes(1);
		expect(vi.getTimerCount()).toBe(0);
	});

	it('does not start before mount', () => {
		const onStart = vi.fn();
		let countdown!: UseCountdownReturn;
		const Comp = defineComponent({
			setup () {
				countdown = useCountdown({ duration: 1_000, onStart });
				expect(countdown.isRunning.value).toBe(false);
				return () => h('span');
			}
		});
		mount(Comp);
		expect(onStart).toHaveBeenCalledTimes(1);
		expect(countdown.isRunning.value).toBe(true);
	});
});

describe('useCountdown in an effect scope', () => {
	it('counts down a duration and updates on whole seconds', () => {
		const countdown = inScope({ duration: 3_000 });
		expect(countdown.remaining.value).toBe(3_000);
		expect(countdown.total.value).toBe(3_000);

		vi.advanceTimersByTime(999);
		expect(countdown.remaining.value).toBe(3_000);
		vi.advanceTimersByTime(1);
		expect(countdown.remaining.value).toBe(2_000);
		vi.advanceTimersByTime(1_000);
		expect(countdown.remaining.value).toBe(1_000);
	});

	it('fires onTick once per displayed change and onFinish once at 0', () => {
		const onTick = vi.fn();
		const onFinish = vi.fn();
		const countdown = inScope({ duration: 3_000, onTick, onFinish });

		vi.advanceTimersByTime(10_000);
		expect(onTick.mock.calls.map(call => call[0])).toEqual([ 3_000, 2_000, 1_000, 0 ]);
		expect(onFinish).toHaveBeenCalledTimes(1);
		expect(countdown.remaining.value).toBe(0);
		expect(countdown.isFinished.value).toBe(true);
		expect(countdown.isRunning.value).toBe(false);
	});

	it('respects precision', () => {
		const onTick = vi.fn();
		inScope({ duration: 1_000, precision: 250, onTick });
		vi.advanceTimersByTime(1_000);
		expect(onTick.mock.calls.map(call => call[0])).toEqual([ 1_000, 750, 500, 250, 0 ]);
	});

	it('freezes the remaining time on pause in duration mode and continues on resume', () => {
		const onPause = vi.fn();
		const onTick = vi.fn();
		const countdown = inScope({ duration: 5_000, onPause, onTick });

		vi.advanceTimersByTime(1_500);
		countdown.pause();
		expect(onPause).toHaveBeenCalledTimes(1);
		expect(countdown.isRunning.value).toBe(false);
		expect(countdown.remaining.value).toBe(3_500);

		vi.advanceTimersByTime(10_000);
		expect(countdown.remaining.value).toBe(3_500);
		const ticksWhilePaused = onTick.mock.calls.length;

		countdown.resume();
		expect(countdown.isRunning.value).toBe(true);
		expect(countdown.remaining.value).toBe(3_500);
		vi.advanceTimersByTime(500);
		expect(countdown.remaining.value).toBe(3_000);
		expect(onTick.mock.calls.length).toBe(ticksWhilePaused + 1);
		vi.advanceTimersByTime(3_000);
		expect(countdown.isFinished.value).toBe(true);
	});

	it('only stops updates on pause in end mode; resume jumps to the real remaining time', () => {
		const countdown = inScope({ end: NOW + 10_000 });
		vi.advanceTimersByTime(2_000);
		countdown.pause();
		expect(countdown.remaining.value).toBe(8_000);

		vi.advanceTimersByTime(3_000);
		expect(countdown.remaining.value).toBe(8_000);

		countdown.resume();
		expect(countdown.remaining.value).toBe(5_000);
	});

	it('restarts from the full duration when started after finishing', () => {
		const onFinish = vi.fn();
		const countdown = inScope({ duration: 2_000, onFinish });
		vi.advanceTimersByTime(2_000);
		expect(countdown.isFinished.value).toBe(true);

		countdown.start();
		expect(countdown.isFinished.value).toBe(false);
		expect(countdown.isRunning.value).toBe(true);
		expect(countdown.remaining.value).toBe(2_000);
		vi.advanceTimersByTime(1_000);
		expect(countdown.remaining.value).toBe(1_000);
		vi.advanceTimersByTime(1_000);
		expect(onFinish).toHaveBeenCalledTimes(2);
	});

	it('does not restart a finished countdown on resume', () => {
		const countdown = inScope({ duration: 1_000 });
		vi.advanceTimersByTime(1_000);
		countdown.resume();
		expect(countdown.isRunning.value).toBe(false);
		expect(countdown.remaining.value).toBe(0);
	});

	it('restores the total time and stops on reset', () => {
		const onReset = vi.fn();
		const onTick = vi.fn();
		const countdown = inScope({ duration: 5_000, onReset, onTick });
		vi.advanceTimersByTime(2_000);

		countdown.reset();
		expect(onReset).toHaveBeenCalledTimes(1);
		expect(countdown.remaining.value).toBe(5_000);
		expect(countdown.isRunning.value).toBe(false);
		expect(countdown.isFinished.value).toBe(false);

		const calls = onTick.mock.calls.length;
		vi.advanceTimersByTime(5_000);
		expect(onTick.mock.calls.length).toBe(calls);
		expect(countdown.remaining.value).toBe(5_000);
	});

	it('does not start with autostart: false', () => {
		const onStart = vi.fn();
		const countdown = inScope({ duration: 3_000, autostart: false, onStart });
		vi.advanceTimersByTime(5_000);
		expect(onStart).not.toHaveBeenCalled();
		expect(countdown.isRunning.value).toBe(false);
		expect(countdown.remaining.value).toBe(3_000);

		countdown.start();
		expect(onStart).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(1_000);
		expect(countdown.remaining.value).toBe(2_000);
	});

	it('resets and restarts when the duration changes while running', async () => {
		const duration = ref(5_000);
		const countdown = inScope({ duration });
		vi.advanceTimersByTime(2_000);

		duration.value = 10_000;
		await nextTick();
		expect(countdown.total.value).toBe(10_000);
		expect(countdown.remaining.value).toBe(10_000);
		expect(countdown.isRunning.value).toBe(true);
		vi.advanceTimersByTime(1_000);
		expect(countdown.remaining.value).toBe(9_000);
	});

	it('resets but stays stopped when the duration changes without autostart', async () => {
		const duration = ref(5_000);
		const countdown = inScope({ duration, autostart: false });

		duration.value = 8_000;
		await nextTick();
		expect(countdown.remaining.value).toBe(8_000);
		expect(countdown.isRunning.value).toBe(false);
	});

	it('restarts when the duration changes after finishing if autostart is on', async () => {
		const duration = ref(1_000);
		const countdown = inScope({ duration });
		vi.advanceTimersByTime(1_000);
		expect(countdown.isFinished.value).toBe(true);

		duration.value = 3_000;
		await nextTick();
		expect(countdown.isRunning.value).toBe(true);
		expect(countdown.remaining.value).toBe(3_000);
	});

	it('resets and restarts when the end changes', async () => {
		const end = ref<Date | number | string>(NOW + 5_000);
		const countdown = inScope({ end });
		vi.advanceTimersByTime(1_000);
		expect(countdown.remaining.value).toBe(4_000);

		end.value = new Date(NOW + 61_000);
		await nextTick();
		expect(countdown.total.value).toBe(60_000);
		expect(countdown.remaining.value).toBe(60_000);
		expect(countdown.isRunning.value).toBe(true);
	});

	it('prefers end over duration', () => {
		const countdown = inScope({ end: NOW + 2_000, duration: 10_000 });
		expect(countdown.remaining.value).toBe(2_000);
	});

	it('accepts end as an ISO string', () => {
		const countdown = inScope({ end: new Date(NOW + 4_000).toISOString() });
		expect(countdown.remaining.value).toBe(4_000);
	});

	it('finishes immediately when end is in the past', () => {
		const onFinish = vi.fn();
		const onTick = vi.fn();
		const countdown = inScope({ end: NOW - 5_000, onFinish, onTick });
		expect(onFinish).toHaveBeenCalledTimes(1);
		expect(onTick).toHaveBeenCalledWith(0);
		expect(countdown.isFinished.value).toBe(true);
		expect(countdown.remaining.value).toBe(0);
	});

	it('clears the timer when the scope is disposed', () => {
		const onTick = vi.fn();
		inScope({ duration: 5_000, onTick });
		expect(onTick).toHaveBeenCalledTimes(1);
		scope!.stop();
		vi.advanceTimersByTime(10_000);
		expect(onTick).toHaveBeenCalledTimes(1);
		expect(vi.getTimerCount()).toBe(0);
	});

	it('updates right away when the page becomes visible again', () => {
		const onTick = vi.fn();
		const countdown = inScope({ duration: 10_000, onTick });
		vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');

		// The browser throttled the timer in a background tab: the clock moved, the timer didn't fire
		vi.setSystemTime(NOW + 3_000);
		expect(countdown.remaining.value).toBe(10_000);

		document.dispatchEvent(new Event('visibilitychange'));
		expect(countdown.remaining.value).toBe(7_000);
		expect(onTick).toHaveBeenLastCalledWith(7_000);
	});

	it('ignores visibilitychange while paused or hidden', () => {
		const countdown = inScope({ duration: 10_000 });
		const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
		vi.setSystemTime(NOW + 3_000);
		document.dispatchEvent(new Event('visibilitychange'));
		expect(countdown.remaining.value).toBe(10_000);

		countdown.pause();
		visibility.mockReturnValue('visible');
		vi.setSystemTime(NOW + 6_000);
		document.dispatchEvent(new Event('visibilitychange'));
		expect(countdown.remaining.value).toBe(7_000);
	});

	it('stops listening to visibilitychange when the scope is disposed', () => {
		const onTick = vi.fn();
		inScope({ duration: 10_000, onTick });
		vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
		scope!.stop();
		vi.setSystemTime(NOW + 3_000);
		document.dispatchEvent(new Event('visibilitychange'));
		expect(onTick).toHaveBeenCalledTimes(1);
	});
});
