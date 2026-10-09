import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount, type VueWrapper } from '@vue/test-utils';
import CountDownCircle, { type CountDownCircleProps } from '../src/components/CountDownCircle.vue';

const mountCircle = (props: CountDownCircleProps = {}, slots = {}) =>
	mount(CountDownCircle, { props: { size: 100, ...props }, slots });

const progressCircle = (wrapper: VueWrapper) => wrapper.find<SVGCircleElement>('circle.circle__progress').element;

const containerStyle = (wrapper: VueWrapper) => (wrapper.element as HTMLElement).style;

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('CountDownCircle', () => {
	it('renders the value and the label', () => {
		const wrapper = mountCircle({ value: 7, label: 'Seconds' });
		expect(wrapper.find('.circle__value').text()).toBe('7');
		expect(wrapper.find('.circle__label').text()).toBe('Seconds');
	});

	it('does not render a label element without a label', () => {
		const wrapper = mountCircle({ value: 7 });
		expect(wrapper.find('.circle__label').exists()).toBe(false);
	});

	it('applies formatValue', () => {
		const wrapper = mountCircle({ value: 7, formatValue: v => String(v).padStart(2, '0') });
		expect(wrapper.find('.circle__value').text()).toBe('07');
	});

	it('passes props to the value slot', () => {
		const value = vi.fn(() => 'custom');
		const wrapper = mountCircle({ value: 7, steps: 30, formatValue: v => `#${v}` }, { value });
		expect(wrapper.find('.circle__value').text()).toBe('custom');
		expect(value).toHaveBeenCalledWith(expect.objectContaining({ value: 7, formattedValue: '#7', steps: 30 }));
	});

	it('passes props to the label slot', () => {
		const label = vi.fn(() => 'custom label');
		const wrapper = mountCircle({ value: 7, label: 'Seconds' }, { label });
		expect(wrapper.find('.circle__label').text()).toBe('custom label');
		expect(label).toHaveBeenCalledWith(expect.objectContaining({ label: 'Seconds', value: 7 }));
	});

	it('renders the label slot without a label prop', () => {
		const wrapper = mountCircle({ value: 7 }, { label: () => 'from slot' });
		expect(wrapper.find('.circle__label').text()).toBe('from slot');
	});

	it('hides the value with showValue: false', () => {
		const wrapper = mountCircle({ value: 7, showValue: false });
		expect(wrapper.find('.circle__value').exists()).toBe(false);
	});

	describe('progress', () => {
		const geometry = (size: number, strokeWidth: number) => 2 * Math.PI * ((size - strokeWidth) / 2);

		it('sets the dash offset from value / steps', () => {
			const wrapper = mountCircle({ value: 15, steps: 60, size: 100, strokeWidth: 10 });
			const circle = progressCircle(wrapper);
			const circumference = geometry(100, 10);
			expect(Number(circle.style.strokeDasharray)).toBeCloseTo(circumference);
			expect(Number(circle.style.strokeDashoffset)).toBeCloseTo(circumference * 0.75);
			expect(circle.style.opacity).toBe('1');
		});

		it('is full at value === steps and clamps above', async () => {
			const wrapper = mountCircle({ value: 60, steps: 60 });
			expect(Number(progressCircle(wrapper).style.strokeDashoffset)).toBeCloseTo(0);
			await wrapper.setProps({ value: 120 });
			expect(Number(progressCircle(wrapper).style.strokeDashoffset)).toBeCloseTo(0);
		});

		it('clamps negative values to empty', () => {
			const wrapper = mountCircle({ value: -5, steps: 60, size: 100, strokeWidth: 10 });
			const circle = progressCircle(wrapper);
			expect(Number(circle.style.strokeDashoffset)).toBeCloseTo(geometry(100, 10));
			expect(circle.style.opacity).toBe('0');
		});

		it('hides the progress circle at value 0', () => {
			const wrapper = mountCircle({ value: 0, steps: 60 });
			expect(progressCircle(wrapper).style.opacity).toBe('0');
		});

		it('updates when the value changes', async () => {
			const wrapper = mountCircle({ value: 0, steps: 4, size: 100, strokeWidth: 10 });
			await wrapper.setProps({ value: 2 });
			const circle = progressCircle(wrapper);
			expect(Number(circle.style.strokeDashoffset)).toBeCloseTo(geometry(100, 10) / 2);
			expect(circle.style.opacity).toBe('1');
		});

		it('mirrors the progress circle when counterclockwise', () => {
			const clockwise = mountCircle({ value: 1 });
			expect(progressCircle(clockwise).getAttribute('transform')).not.toContain('scale(-1 1)');

			const counterclockwise = mountCircle({ value: 1, direction: 'counterclockwise' });
			expect(progressCircle(counterclockwise).getAttribute('transform')).toContain('scale(-1 1)');
		});

		it('applies strokeLinecap and strokeWidth', () => {
			const wrapper = mountCircle({ value: 1, strokeLinecap: 'round', strokeWidth: 4 });
			const circle = progressCircle(wrapper);
			expect(circle.getAttribute('stroke-linecap')).toBe('round');
			expect(circle.getAttribute('stroke-width')).toBe('4');
		});
	});

	describe('styles', () => {
		it('sets CSS custom properties from color and font props', () => {
			const wrapper = mountCircle({
				strokeColor: 'red',
				underneathStrokeColor: 'blue',
				fillColor: 'green',
				valueFontSize: 30,
				labelFontSize: 12
			});
			const style = containerStyle(wrapper);
			expect(style.getPropertyValue('--cdt-stroke-color')).toBe('red');
			expect(style.getPropertyValue('--cdt-underneath-stroke-color')).toBe('blue');
			expect(style.getPropertyValue('--cdt-fill-color')).toBe('green');
			expect(style.getPropertyValue('--cdt-value-font-size')).toBe('30px');
			expect(style.getPropertyValue('--cdt-label-font-size')).toBe('12px');
		});

		it('does not set CSS custom properties for props that are not set', () => {
			const style = containerStyle(mountCircle());
			for (const name of [
				'--cdt-stroke-color',
				'--cdt-underneath-stroke-color',
				'--cdt-fill-color',
				'--cdt-value-font-size',
				'--cdt-label-font-size'
			]) {
				expect(style.getPropertyValue(name)).toBe('');
			}
		});

		it('sets the size of the circle', () => {
			const wrapper = mountCircle({ size: 120 });
			const svg = wrapper.find('svg');
			expect(svg.attributes('width')).toBe('120');
			expect(svg.attributes('height')).toBe('120');
			expect(containerStyle(wrapper).width).toBe('120px');
		});

		it('adds a modifier class for the label position', () => {
			expect(mountCircle({ label: 'a' }).classes()).toContain('circle__container--label-bottom');
			const top = mountCircle({ label: 'a', labelPosition: 'top' });
			expect(top.classes()).toContain('circle__container--label-top');
			expect(top.classes()).not.toContain('circle__container--label-bottom');
		});
	});

	describe('size: 0', () => {
		let parentHeight = 0;
		const LABEL_HEIGHT = 20;

		class ResizeObserverStub {
			static instances: ResizeObserverStub[] = [];
			observed: Element[] = [];
			disconnect = vi.fn();
			constructor (public callback: ResizeObserverCallback) {
				ResizeObserverStub.instances.push(this);
			}

			observe (element: Element) {
				this.observed.push(element);
			}

			unobserve () {}

			trigger () {
				this.callback([], this as unknown as ResizeObserver);
			}
		}

		const mountInParent = (props: CountDownCircleProps) => mount(defineComponent({
			setup: () => () => h('div', { class: 'parent' }, [ h(CountDownCircle, props) ])
		}));

		const svgSize = (wrapper: VueWrapper) => wrapper.find('svg').attributes('width');

		const setup = () => {
			ResizeObserverStub.instances = [];
			vi.stubGlobal('ResizeObserver', ResizeObserverStub);
			vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function (this: Element) {
				return this.classList.contains('parent') ? parentHeight : 0;
			});
			vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
				return this.classList.contains('circle__label') ? LABEL_HEIGHT : 0;
			});
		};

		it('fits the parent height minus the label height', async () => {
			setup();
			parentHeight = 200;
			const wrapper = mountInParent({ value: 1, label: 'Seconds' });
			await nextTick();
			expect(svgSize(wrapper)).toBe(String(200 - LABEL_HEIGHT));
		});

		it('fits the parent height without a label', async () => {
			setup();
			parentHeight = 150;
			const wrapper = mountInParent({ value: 1 });
			await nextTick();
			expect(svgSize(wrapper)).toBe('150');
		});

		it('reacts to ResizeObserver callbacks', async () => {
			setup();
			parentHeight = 200;
			const wrapper = mountInParent({ value: 1, label: 'Seconds' });
			expect(ResizeObserverStub.instances).toHaveLength(1);
			const observer = ResizeObserverStub.instances[0]!;
			expect(observer.observed).toContain(wrapper.find('.parent').element);
			expect(observer.observed).toContain(wrapper.find('.circle__label').element);

			parentHeight = 320;
			observer.trigger();
			await nextTick();
			expect(svgSize(wrapper)).toBe(String(320 - LABEL_HEIGHT));
		});

		it('disconnects the ResizeObserver on unmount', () => {
			setup();
			parentHeight = 200;
			const wrapper = mountInParent({ value: 1 });
			const observer = ResizeObserverStub.instances[0]!;
			expect(observer.disconnect).not.toHaveBeenCalled();
			wrapper.unmount();
			expect(observer.disconnect).toHaveBeenCalledTimes(1);
		});

		it('ignores the parent size when size is set', async () => {
			setup();
			parentHeight = 200;
			const wrapper = mountInParent({ value: 1, size: 80 });
			await nextTick();
			expect(svgSize(wrapper)).toBe('80');
		});
	});
});
