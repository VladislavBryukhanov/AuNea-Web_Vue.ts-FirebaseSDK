import Vue from 'vue';
import App from './App.vue';
// FIXME can't import firebase in this file - it will not be available in store
import '@/firebase';
import store from './store';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

// TODO customize theme
Vue.use(Vuetify, {
    iconfont: 'md',
});

new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount('#app');
