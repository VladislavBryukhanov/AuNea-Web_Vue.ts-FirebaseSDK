import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// const UserList = () => import('@/UserList');
// const UserList = () => import('@/components/UserList');
const UserList = () => import('@/components/UserList');
// const UserList = () => import('@components/UserList');

export default new Router ({
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: UserList,
            name: 'UserList',
        },
    ],
})