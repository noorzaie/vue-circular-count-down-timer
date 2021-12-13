import Vue from 'vue'
import CircularCountDownTimer from 'vue-circular-count-down-timer';
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(CircularCountDownTimer);

new Vue({
  render: h => h(App),
}).$mount('#app')
