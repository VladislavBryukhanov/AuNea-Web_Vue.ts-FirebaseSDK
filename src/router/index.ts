import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const UserList = () => import('@/pages/UserList.vue');
const Sign = () => import('@/pages/Sign.vue');

export default new Router ({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'SingIn',
            component: Sign,
            props: {
                isSignUp: false,
            }
        },
        {
            path: '/signUp',
            name: 'SingUp',
            component: Sign,
            props: {
                isSignUp: true,
            }
        },
        {
            path: '/UserList',
            component: UserList,
            name: 'UserList',
            meta: {
                title: 'User list'
            },
        },
    ],
})