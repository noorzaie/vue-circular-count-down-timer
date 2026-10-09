import { createApp } from 'vue';
import CircularCountDownTimer from 'vue-circular-count-down-timer';
import App from './App.vue';
import './styles.css';

createApp(App)
	.use(CircularCountDownTimer)
	.mount('#app');
