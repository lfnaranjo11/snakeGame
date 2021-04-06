import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { defineCustomElements as defineIonPhaser } from '@ion-phaser/core/loader';

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/ion-\w*/];
defineIonPhaser(window);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
