import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, reactive } from 'vue';
import { mount, type VueWrapper } from '@vue/test-utils';
import CircularCountDownTimer, { type CircularCountDownTimerProps } from '../src/components/CircularCountDownTimer.vue';
import type { CircleConfig, CircleValues } from '../src/types';

const NOW = Date.UTC(2030, 0, 1, 0, 0, 0);

/** 0 min 3 sec, counting down. */
const clockCircles = (): CircleConfig[] => [
	{ id: 'm', steps: 60, value: 0, stepLength: -1, label: 'min' },
	{ id: 's', steps: 60, value: 3, stepLength: -1, dependentCircles: [ 'm' ], label: 'sec' }
];

const mountTimer = (props: Partial<CircularCountDownTimerProps> = {}, slots = {}) => mount(CircularCountDownTimer, {
	props: {
		circles: clockCircles(),
		mainCircleId: 's',
		stopConditions: { m: 0, s: 0 },
		size: 100,
		...props
	},
	slots
});

type Timer = VueWrapper<InstanceType<typeof CircularCountDownTimer>>;

const shownValues = (wrapper: Timer) => wrapper.findAll('.circle__value').map(value => value.text());
const updates = (wrapper: Timer) => (wrapper.emitted('update') ?? []).map(args => args[0] as CircleValues);
const countOf = (wrapper: Timer, event: string) => wrapper.emitted(event)?.length ?? 0;

const step = async (ms = 1_000) => {
	vi.advanceTimersByTime(ms);
	await nextTick();
};

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(NOW);
});

afterEach(() => {
	vi.useRealTimers();
});

describe('CircularCountDownTimer', () => {
	it('renders the initial values', () => {
		const wrapper = mountTimer();
		expect(shownValues(wrapper)).toEqual([ '0', '3' ]);
		expect(wrapper.findAll('.circle__label').map(label => label.text())).toEqual([ 'min', 'sec' ]);
	});

	it('counts on mount, emits update per step, then finished, then stops', async () => {
		const wrapper = mountTimer();
		expect(countOf(wrapper, 'started')).toBe(1);
		expect(wrapper.vm.isRunning).toBe(true);

		await step(999);
		expect(updates(wrapper)).toEqual([]);
		await step(1);
		expect(updates(wrapper)).toEqual([ { m: 0, s: 2 } ]);
		expect(shownValues(wrapper)).toEqual([ '0', '2' ]);

		await step(2_000);
		expect(updates(wrapper)).toEqual([ { m: 0, s: 2 }, { m: 0, s: 1 }, { m: 0, s: 0 } ]);
		expect(countOf(wrapper, 'finished')).toBe(1);
		expect(wrapper.vm.isRunning).toBe(false);
		expect(wrapper.vm.isFinished).toBe(true);

		await step(10_000);
		expect(updates(wrapper)).toHaveLength(3);
		expect(countOf(wrapper, 'finished')).toBe(1);
		expect(shownValues(wrapper)).toEqual([ '0', '0' ]);
	});

	it('moves dependent circles when the main circle wraps', async () => {
		const wrapper = mountTimer({
			circles: [
				{ id: 'm', steps: 60, value: 2, stepLength: -1 },
				{ id: 's', steps: 60, value: 1, stepLength: -1, dependentCircles: [ 'm' ] }
			],
			stopConditions: {}
		});
		await step(2_000);
		expect(updates(wrapper)).toEqual([ { m: 2, s: 0 }, { m: 1, s: 59 } ]);
	});

	it('emits finished but not update with triggerUpdate: false', async () => {
		const wrapper = mountTimer({ triggerUpdate: false });
		await step(3_000);
		expect(wrapper.emitted('update')).toBeUndefined();
		expect(countOf(wrapper, 'finished')).toBe(1);
		expect(shownValues(wrapper)).toEqual([ '0', '0' ]);
	});

	it('does not start with autostart: false until start() is called', async () => {
		const wrapper = mountTimer({ autostart: false });
		await step(5_000);
		expect(wrapper.emitted('started')).toBeUndefined();
		expect(wrapper.emitted('update')).toBeUndefined();
		expect(wrapper.vm.isRunning).toBe(false);

		wrapper.vm.start();
		expect(countOf(wrapper, 'started')).toBe(1);
		await step(1_000);
		expect(updates(wrapper)).toEqual([ { m: 0, s: 2 } ]);
	});

	it('restarts from the initial values when started after finishing', async () => {
		const wrapper = mountTimer();
		await step(3_000);
		expect(wrapper.vm.isFinished).toBe(true);

		wrapper.vm.start();
		await nextTick();
		expect(shownValues(wrapper)).toEqual([ '0', '3' ]);
		await step(1_000);
		expect(updates(wrapper).at(-1)).toEqual({ m: 0, s: 2 });
	});

	it('keeps the progress of a partial interval on pause and resume', async () => {
		const wrapper = mountTimer();
		await step(600);
		wrapper.vm.pause();
		expect(countOf(wrapper, 'paused')).toBe(1);
		expect(wrapper.vm.isRunning).toBe(false);

		await step(5_000);
		expect(wrapper.emitted('update')).toBeUndefined();

		wrapper.vm.resume();
		expect(countOf(wrapper, 'started')).toBe(2);
		await step(399);
		expect(wrapper.emitted('update')).toBeUndefined();
		await step(1);
		expect(updates(wrapper)).toEqual([ { m: 0, s: 2 } ]);
		await step(1_000);
		expect(updates(wrapper)).toEqual([ { m: 0, s: 2 }, { m: 0, s: 1 } ]);
	});

	it('does not emit paused when not running', () => {
		const wrapper = mountTimer({ autostart: false });
		wrapper.vm.pause();
		expect(wrapper.emitted('paused')).toBeUndefined();
	});

	it('restores the initial values, stops and emits reset on reset()', async () => {
		const wrapper = mountTimer();
		await step(2_000);
		expect(shownValues(wrapper)).toEqual([ '0', '1' ]);

		wrapper.vm.reset();
		await nextTick();
		expect(countOf(wrapper, 'reset')).toBe(1);
		expect(shownValues(wrapper)).toEqual([ '0', '3' ]);
		expect(wrapper.vm.values).toEqual({ m: 0, s: 3 });
		expect(wrapper.vm.isRunning).toBe(false);

		await step(5_000);
		expect(updates(wrapper)).toHaveLength(2);

		// A full interval after start, not the rest of the interval before the reset
		wrapper.vm.start();
		await step(999);
		expect(updates(wrapper)).toHaveLength(2);
		await step(1);
		expect(updates(wrapper).at(-1)).toEqual({ m: 0, s: 2 });
	});

	it('stops the timer on unmount', async () => {
		const wrapper = mountTimer();
		await step(1_000);
		const emitted = wrapper.emitted();
		const updateCount = emitted.update?.length;
		wrapper.unmount();
		vi.advanceTimersByTime(10_000);
		expect(emitted.update?.length).toBe(updateCount);
		expect(emitted.finished).toBeUndefined();
		expect(vi.getTimerCount()).toBe(0);
	});

	describe('appearance', () => {
		const strokeColors = (wrapper: Timer) => wrapper.findAll<HTMLElement>('.circle__container')
			.map(container => container.element.style.getPropertyValue('--cdt-stroke-color'));

		it('lets circle options override shared options; undefined falls back to shared', () => {
			const wrapper = mountTimer({
				strokeColor: 'red',
				labelPosition: 'top',
				circles: [
					{ id: 'm', steps: 60, strokeColor: 'blue', labelPosition: 'bottom', label: 'min' },
					{ id: 's', steps: 60, strokeColor: undefined, labelPosition: undefined, label: 'sec' }
				]
			});
			expect(strokeColors(wrapper)).toEqual([ 'blue', 'red' ]);
			const containers = wrapper.findAll('.circle__container');
			expect(containers[0]!.classes()).toContain('circle__container--label-bottom');
			expect(containers[1]!.classes()).toContain('circle__container--label-top');
		});

		it('applies per-circle formatValue over the shared one', () => {
			const wrapper = mountTimer({
				formatValue: v => String(v).padStart(2, '0'),
				circles: [
					{ id: 'm', steps: 60, value: 1, formatValue: v => `${v}m` },
					{ id: 's', steps: 60, value: 3 }
				]
			});
			expect(shownValues(wrapper)).toEqual([ '1m', '03' ]);
		});

		it('replaces circleClasses with a circle classList', () => {
			const wrapper = mountTimer({
				containerClasses: [ 'my-container' ],
				circleClasses: [ 'shared' ],
				circles: [
					{ id: 'm', steps: 60, classList: [ 'own' ] },
					{ id: 's', steps: 60 }
				]
			});
			expect(wrapper.classes()).toContain('my-container');
			const items = wrapper.findAll('.circle__item');
			expect(items[0]!.classes()).toEqual([ 'circle__item', 'own' ]);
			expect(items[1]!.classes()).toEqual([ 'circle__item', 'shared' ]);
		});
	});

	describe('slots', () => {
		it('passes the circle to the value slot', () => {
			const value = vi.fn(({ formattedValue }: { formattedValue: string | number }) => `[${formattedValue}]`);
			const circles = clockCircles();
			const wrapper = mountTimer({ circles }, { value });
			expect(shownValues(wrapper)).toEqual([ '[0]', '[3]' ]);
			expect(value).toHaveBeenCalledWith(expect.objectContaining({ value: 3, formattedValue: 3, steps: 60, circle: circles[1] }));
		});

		it('passes the circle to the label slot', () => {
			const label = vi.fn(({ label }: { label: string }) => label.toUpperCase());
			const circles = clockCircles();
			const wrapper = mountTimer({ circles }, { label });
			expect(wrapper.findAll('.circle__label').map(element => element.text())).toEqual([ 'MIN', 'SEC' ]);
			expect(label).toHaveBeenCalledWith(expect.objectContaining({ label: 'min', value: 0, circle: circles[0] }));
		});
	});

	describe('accessibility', () => {
		it('has role timer and a default aria-label from values and labels', async () => {
			const wrapper = mountTimer();
			expect(wrapper.attributes('role')).toBe('timer');
			expect(wrapper.attributes('aria-label')).toBe('0 min, 3 sec');
			await step(1_000);
			expect(wrapper.attributes('aria-label')).toBe('0 min, 2 sec');
		});

		it('uses formatValue in the default aria-label', () => {
			const wrapper = mountTimer({ formatValue: v => String(v).padStart(2, '0') });
			expect(wrapper.attributes('aria-label')).toBe('00 min, 03 sec');
		});

		it('omits missing labels in the default aria-label', () => {
			const wrapper = mountTimer({ circles: [ { id: 'a', steps: 10, value: 4 }, { id: 'b', steps: 10, value: 5 } ] });
			expect(wrapper.attributes('aria-label')).toBe('4, 5');
		});

		it('can be overridden with ariaLabel', () => {
			const wrapper = mountTimer({ ariaLabel: 'Time left' });
			expect(wrapper.attributes('aria-label')).toBe('Time left');
		});
	});

	describe('changing props', () => {
		it('resets and restarts when a circle is pushed into the circles array', async () => {
			const circles = reactive(clockCircles());
			const wrapper = mountTimer({ circles });
			await step(1_000);
			expect(wrapper.vm.values).toEqual({ m: 0, s: 2 });

			circles.push({ id: 'x', steps: 10, value: 5 });
			await nextTick();
			expect(wrapper.vm.values).toEqual({ m: 0, s: 3, x: 5 });
			expect(shownValues(wrapper)).toEqual([ '0', '3', '5' ]);
			expect(wrapper.vm.isRunning).toBe(true);

			await step(1_000);
			expect(wrapper.vm.values).toEqual({ m: 0, s: 2, x: 5 });
		});

		it('resets and restarts when the circles prop is replaced', async () => {
			const wrapper = mountTimer();
			await step(1_000);
			await wrapper.setProps({ circles: [ { id: 's', steps: 60, value: 10, stepLength: -1 } ] });
			expect(wrapper.vm.values).toEqual({ s: 10 });
			expect(wrapper.vm.isRunning).toBe(true);
			await step(1_000);
			expect(wrapper.vm.values).toEqual({ s: 9 });
		});

		it('does not reset the values when a nested circle option changes', async () => {
			const circles = reactive(clockCircles());
			const wrapper = mountTimer({ circles });
			await step(1_000);

			circles[1]!.strokeColor = 'green';
			await nextTick();
			expect(wrapper.vm.values).toEqual({ m: 0, s: 2 });
			expect(wrapper.vm.isRunning).toBe(true);
			expect(countOf(wrapper, 'started')).toBe(1);
			const container = wrapper.findAll<HTMLElement>('.circle__container')[1]!;
			expect(container.element.style.getPropertyValue('--cdt-stroke-color')).toBe('green');

			await step(1_000);
			expect(wrapper.vm.values).toEqual({ m: 0, s: 1 });
		});

		it('keeps the current values when the interval changes while running', async () => {
			const wrapper = mountTimer({ circles: [ { id: 's', steps: 60, value: 30, stepLength: -1 } ], stopConditions: {} });
			await step(1_300);
			expect(wrapper.vm.values).toEqual({ s: 29 });

			await wrapper.setProps({ interval: 500 });
			expect(wrapper.vm.values).toEqual({ s: 29 });
			expect(wrapper.vm.isRunning).toBe(true);
			await step(499);
			expect(wrapper.vm.values).toEqual({ s: 29 });
			await step(1);
			expect(wrapper.vm.values).toEqual({ s: 28 });
			await step(500);
			expect(wrapper.vm.values).toEqual({ s: 27 });
		});
	});

	it('catches up after the clock jumps forward, with a single update', async () => {
		const wrapper = mountTimer({ circles: [ { id: 's', steps: 60, value: 30, stepLength: -1 } ], stopConditions: {} });

		// The browser throttled the timer in a background tab: 9 intervals pass, then the pending timer fires
		vi.setSystemTime(NOW + 9_000);
		vi.advanceTimersToNextTimer();
		await nextTick();

		expect(Date.now()).toBe(NOW + 10_000);
		expect(updates(wrapper)).toEqual([ { s: 20 } ]);
		expect(shownValues(wrapper)).toEqual([ '20' ]);

		await step(1_000);
		expect(updates(wrapper)).toEqual([ { s: 20 }, { s: 19 } ]);
	});

	it('stops on catch-up exactly at the stop conditions', async () => {
		const wrapper = mountTimer();
		vi.setSystemTime(NOW + 59_000);
		vi.advanceTimersToNextTimer();
		await nextTick();
		expect(updates(wrapper)).toEqual([ { m: 0, s: 0 } ]);
		expect(countOf(wrapper, 'finished')).toBe(1);
	});
});
