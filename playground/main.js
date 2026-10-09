import { createApp } from 'vue';
import App from './App.vue';
import CircularCountDownTimer from '../src/components/index.js';

createApp(App)
	.use(CircularCountDownTimer)
	.mount('#app');
