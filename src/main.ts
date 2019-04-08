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
    theme: {
        primary: '#558DC4',
        whiteShadow: '#f1f1f1',
        solid_dark: '#282828',
        solid_black: '#161616',
        onlineColor: '#558DC4',
        offlineColor: '#ffffff',
        afkColor: '#FFF171',
        incomingMessage: '#243443',
        outcomeMessage: '#1A567B',
        lightBlue: '#6B9BC2',
        darkRed: '#a43931',
        lightIonic: '#14aba8',
        lincIonicColor: '#00aca2',
        darkIonic: '#00726a',
    }
});

new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount('#app');
