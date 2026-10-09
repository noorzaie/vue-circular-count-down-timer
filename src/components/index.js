import CircularCountDownTimer from './CircularCountDownTimer.vue';
import CountDownCircle from './CountDownCircle.vue';

export { CircularCountDownTimer, CountDownCircle };

export default {
	install (app) {
		// Register the component globally
		// https://vuejs.org/guide/components/registration.html#global-registration
		app.component('CircularCountDownTimer', CircularCountDownTimer);
	}
};
