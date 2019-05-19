import Vue from 'vue';
import CircularCountDownTimer from './CircularCountDownTimer'

const Components = {
    CircularCountDownTimer
};

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;