import CircularCountDownTimer from './CircularCountDownTimer'

export default {
    install(Vue, options) {
        // Let's register our component globally
        // https://vuejs.org/v2/guide/components-registration.html
        Vue.component("circular-count-down-timer", CircularCountDownTimer);
    }
};
