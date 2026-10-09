import { describe, expect, it } from 'vitest';
import { createApp } from 'vue';
import plugin, {
	CircularCountDownTimer,
	CircularTimeCountDown,
	CountDownCircle,
	splitTime,
	useCountdown
} from '../src/index';

describe('plugin', () => {
	it('registers the three components globally', () => {
		const app = createApp({ render: () => null });
		app.use(plugin);
		expect(app.component('CircularCountDownTimer')).toBe(CircularCountDownTimer);
		expect(app.component('CircularTimeCountDown')).toBe(CircularTimeCountDown);
		expect(app.component('CountDownCircle')).toBe(CountDownCircle);
	});

	it('has named exports', () => {
		expect(CircularCountDownTimer).toBeDefined();
		expect(CircularTimeCountDown).toBeDefined();
		expect(CountDownCircle).toBeDefined();
		expect(typeof useCountdown).toBe('function');
		expect(splitTime(90_000, [ 'minutes', 'seconds' ])).toEqual({ minutes: 1, seconds: 30 });
	});
});
