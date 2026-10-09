import type { Plugin } from 'vue';
import CircularCountDownTimer from './components/CircularCountDownTimer.vue';
import CircularTimeCountDown from './components/CircularTimeCountDown.vue';
import CountDownCircle from './components/CountDownCircle.vue';

export { CircularCountDownTimer, CircularTimeCountDown, CountDownCircle };
export { useCountdown } from './composables/useCountdown';
export { splitTime } from './core/time';

export type { UseCountdownOptions, UseCountdownReturn } from './composables/useCountdown';
export type { CircularCountDownTimerProps } from './components/CircularCountDownTimer.vue';
export type { CircularTimeCountDownProps } from './components/CircularTimeCountDown.vue';
export type { CountDownCircleProps } from './components/CountDownCircle.vue';
export type * from './types';

/** Registers the components globally: `app.use(CircularCountDownTimer)`. */
const plugin: Plugin = {
	install (app) {
		app.component('CircularCountDownTimer', CircularCountDownTimer);
		app.component('CircularTimeCountDown', CircularTimeCountDown);
		app.component('CountDownCircle', CountDownCircle);
	}
};

export default plugin;

declare module 'vue' {
	export interface GlobalComponents {
		CircularCountDownTimer: typeof CircularCountDownTimer;
		CircularTimeCountDown: typeof CircularTimeCountDown;
		CountDownCircle: typeof CountDownCircle;
	}
}
