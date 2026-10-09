import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount, type VueWrapper } from '@vue/test-utils';
import CircularTimeCountDown, { type CircularTimeCountDownProps } from '../src/components/CircularTimeCountDown.vue';
import type { TimeUnit, TimeUpdate } from '../src/types';

const NOW = Date.UTC(2030, 0, 1, 0, 0, 0);

type ValueSlotProps = { value: number; formattedValue: string | number; steps: number; unit: TimeUnit };
type Countdown = VueWrapper<InstanceType<typeof CircularTimeCountDown>>;

const mountCountdown = (props: CircularTimeCountDownProps = {}, slots = {}) =>
	mount(CircularTimeCountDown, { props: { size: 100, ...props }, slots });

const shownValues = (wrapper: Countdown) => wrapper.findAll('.circle__value').map(value => value.text());
const shownLabels = (wrapper: Countdown) => wrapper.findAll('.circle__label').map(label => label.text());
const updates = (wrapper: Countdown) => (wrapper.emitted('update') ?? []).map(args => args[0] as TimeUpdate);

/** Steps of each rendered circle, read from the value slot. */
const stepsByUnit = (props: CircularTimeCountDownProps) => {
	const steps: Partial<Record<TimeUnit, number>> = {};
	mountCountdown(props, {
		value: (slotProps: ValueSlotProps) => {
			steps[slotProps.unit] = slotProps.steps;
			return String(slotProps.value);
		}
	});
	return steps;
};

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

describe('CircularTimeCountDown', () => {
	it('splits the duration into the units', () => {
		const wrapper = mountCountdown({ duration: 90_000, units: [ 'minutes', 'seconds' ] });
		expect(shownValues(wrapper)).toEqual([ '1', '30' ]);
	});

	it('uses all four units by default', () => {
		const wrapper = mountCountdown({ duration: ((24 + 2) * 60 + 3) * 60_000 + 4_000 });
		expect(shownValues(wrapper)).toEqual([ '1', '2', '3', '4' ]);
		expect(shownLabels(wrapper)).toEqual([ 'days', 'hours', 'minutes', 'seconds' ]);
	});

	it('renders units from largest to smallest regardless of input order', () => {
		const wrapper = mountCountdown({ duration: 3_690_000, units: [ 'seconds', 'hours', 'minutes' ] });
		expect(shownLabels(wrapper)).toEqual([ 'hours', 'minutes', 'seconds' ]);
		expect(shownValues(wrapper)).toEqual([ '1', '1', '30' ]);
	});

	it('puts the overflow into the largest unit', () => {
		const wrapper = mountCountdown({ duration: 50 * 3_600_000, units: [ 'hours', 'minutes' ] });
		expect(shownValues(wrapper)).toEqual([ '50', '0' ]);
	});

	describe('labels and circle options', () => {
		it('lets the labels prop override the unit names', () => {
			const wrapper = mountCountdown({
				duration: 90_000,
				units: [ 'minutes', 'seconds' ],
				labels: { minutes: 'Minuten' }
			});
			expect(shownLabels(wrapper)).toEqual([ 'Minuten', 'seconds' ]);
		});

		it('lets circleOptions override the label, steps and appearance', () => {
			const wrapper = mountCountdown({
				duration: 90_000,
				units: [ 'minutes', 'seconds' ],
				strokeColor: 'red',
				labels: { seconds: 'Sekunden' },
				circleOptions: {
					seconds: { label: 'sec', steps: 30, strokeColor: 'blue', classList: [ 'own' ] }
				}
			});
			expect(shownLabels(wrapper)).toEqual([ 'minutes', 'sec' ]);
			const colors = wrapper.findAll<HTMLElement>('.circle__container')
				.map(container => container.element.style.getPropertyValue('--cdt-stroke-color'));
			expect(colors).toEqual([ 'red', 'blue' ]);
			expect(wrapper.findAll('.circle__item')[1]!.classes()).toEqual([ 'circle__item', 'own' ]);

			expect(stepsByUnit({
				duration: 90_000,
				units: [ 'minutes', 'seconds' ],
				circleOptions: { seconds: { steps: 30 } }
			})).toEqual({ minutes: 1, seconds: 30 });
		});

		it('uses the initial value as steps of the largest unit and natural steps for the others', () => {
			expect(stepsByUnit({ duration: 3 * 86_400_000 + 1_000 })).toEqual({ days: 3, hours: 24, minutes: 60, seconds: 60 });
			expect(stepsByUnit({ duration: 5 * 3_600_000, units: [ 'hours', 'minutes' ] })).toEqual({ hours: 5, minutes: 60 });
			expect(stepsByUnit({ duration: 30_000, units: [ 'minutes', 'seconds' ] })).toEqual({ minutes: 1, seconds: 60 });
		});
	});

	describe('counting', () => {
		it('emits update with the split parts and the remaining time', async () => {
			const wrapper = mountCountdown({ duration: 90_000, units: [ 'minutes', 'seconds' ] });
			expect(wrapper.emitted('started')).toHaveLength(1);
			expect(updates(wrapper)).toEqual([ { minutes: 1, seconds: 30, remaining: 90_000 } ]);

			await step(1_000);
			expect(updates(wrapper).at(-1)).toEqual({ minutes: 1, seconds: 29, remaining: 89_000 });
			expect(shownValues(wrapper)).toEqual([ '1', '29' ]);
		});

		it('emits update when the smallest unit changes', async () => {
			const wrapper = mountCountdown({ duration: 3 * 60_000, units: [ 'minutes' ] });
			await step(59_000);
			expect(updates(wrapper)).toHaveLength(1);
			await step(1_000);
			expect(updates(wrapper).at(-1)).toEqual({ minutes: 2, remaining: 120_000 });
		});

		it('finishes and emits finished', async () => {
			const wrapper = mountCountdown({ duration: 2_000, units: [ 'minutes', 'seconds' ] });
			await step(2_000);
			expect(wrapper.emitted('finished')).toHaveLength(1);
			expect(shownValues(wrapper)).toEqual([ '0', '0' ]);
			expect(updates(wrapper).at(-1)).toEqual({ minutes: 0, seconds: 0, remaining: 0 });
			expect(wrapper.vm.isFinished).toBe(true);

			await step(5_000);
			expect(wrapper.emitted('finished')).toHaveLength(1);
		});

		it.each([
			[ 'Date', new Date(NOW + 90_000) ],
			[ 'number', NOW + 90_000 ],
			[ 'ISO string', new Date(NOW + 90_000).toISOString() ]
		])('counts down to an end given as a %s', async (_, end) => {
			const wrapper = mountCountdown({ end, units: [ 'minutes', 'seconds' ] });
			expect(shownValues(wrapper)).toEqual([ '1', '30' ]);
			await step(30_000);
			expect(shownValues(wrapper)).toEqual([ '1', '0' ]);
			await step(60_000);
			expect(wrapper.emitted('finished')).toHaveLength(1);
		});

		it('does not start with autostart: false', async () => {
			const wrapper = mountCountdown({ duration: 5_000, units: [ 'seconds' ], autostart: false });
			await step(2_000);
			expect(wrapper.emitted('started')).toBeUndefined();
			expect(shownValues(wrapper)).toEqual([ '5' ]);
		});

		it('does not reset when an equal end date is passed again', async () => {
			// e.g. `:end="new Date('...')"` inline in a template creates a new Date on every render
			const wrapper = mountCountdown({ end: new Date(NOW + 90_000), units: [ 'minutes', 'seconds' ] });
			await step(10_000);
			await wrapper.setProps({ end: new Date(NOW + 90_000) });
			expect(shownValues(wrapper)).toEqual([ '1', '20' ]);
			expect(wrapper.emitted('started')).toHaveLength(1);
		});

		it('resets and restarts when the duration prop changes', async () => {
			const wrapper = mountCountdown({ duration: 5_000, units: [ 'seconds' ] });
			await step(2_000);
			await wrapper.setProps({ duration: 30_000 });
			expect(shownValues(wrapper)).toEqual([ '30' ]);
			await step(1_000);
			expect(shownValues(wrapper)).toEqual([ '29' ]);
		});
	});

	it('exposes start, pause, resume, reset and remaining', async () => {
		const wrapper = mountCountdown({ duration: 10_000, units: [ 'seconds' ], autostart: false });
		expect(wrapper.vm.remaining).toBe(10_000);

		wrapper.vm.start();
		await step(2_000);
		expect(wrapper.vm.remaining).toBe(8_000);
		expect(wrapper.vm.isRunning).toBe(true);

		wrapper.vm.pause();
		expect(wrapper.emitted('paused')).toHaveLength(1);
		await step(3_000);
		expect(wrapper.vm.remaining).toBe(8_000);

		wrapper.vm.resume();
		await step(1_000);
		expect(wrapper.vm.remaining).toBe(7_000);
		expect(shownValues(wrapper)).toEqual([ '7' ]);

		wrapper.vm.reset();
		await nextTick();
		expect(wrapper.emitted('reset')).toHaveLength(1);
		expect(wrapper.vm.remaining).toBe(10_000);
		expect(wrapper.vm.isRunning).toBe(false);
		expect(shownValues(wrapper)).toEqual([ '10' ]);
	});

	it('passes the unit to the value and label slots', () => {
		const value = vi.fn((props: ValueSlotProps) => `${props.unit}:${props.value}`);
		const label = vi.fn((props: { label: string; value: number; unit: TimeUnit }) => `${props.unit}/${props.label}`);
		const wrapper = mountCountdown({ duration: 90_000, units: [ 'minutes', 'seconds' ] }, { value, label });
		expect(shownValues(wrapper)).toEqual([ 'minutes:1', 'seconds:30' ]);
		expect(shownLabels(wrapper)).toEqual([ 'minutes/minutes', 'seconds/seconds' ]);
		expect(value).toHaveBeenCalledWith(expect.objectContaining({ unit: 'seconds', value: 30, steps: 60, formattedValue: 30 }));
		expect(label).toHaveBeenCalledWith(expect.objectContaining({ unit: 'minutes', label: 'minutes', value: 1 }));
	});

	it('has role timer and a default aria-label', () => {
		const wrapper = mountCountdown({
			duration: 90_000,
			units: [ 'minutes', 'seconds' ],
			formatValue: v => String(v).padStart(2, '0')
		});
		expect(wrapper.attributes('role')).toBe('timer');
		expect(wrapper.attributes('aria-label')).toBe('01 minutes, 30 seconds');
		expect(mountCountdown({ duration: 1_000, ariaLabel: 'Left' }).attributes('aria-label')).toBe('Left');
	});

	it('stops the countdown on unmount', () => {
		const wrapper = mountCountdown({ duration: 5_000, units: [ 'seconds' ] });
		const emitted = wrapper.emitted();
		wrapper.unmount();
		vi.advanceTimersByTime(10_000);
		expect(emitted.update).toHaveLength(1);
		expect(emitted.finished).toBeUndefined();
	});
});
