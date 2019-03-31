import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import {AuthStates} from '@/constants/auth';

Vue.use(Router);

const UnauthorizedToolbar = () => import('@/components/toolbars/UnauthorizedToolbar.vue');
const AuthorizedToolbar = () => import('@/components/toolbars/AuthorizedToolbar.vue');
const Sign = () => import('@/pages/Sign.vue');
const UserList = () => import('@/pages/UserList.vue');
const Settings = () => import('@/pages/Profile.vue');

const router = new Router ({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: UnauthorizedToolbar,
            meta: {
                requiredUnauth: true,
            },
            children: [
                {
                    path: '',
                    name: 'SingIn',
                    component: Sign,
                },
                {
                    path: 'SignUp',
                    name: 'SingUp',
                    component: Sign,
                    props: {
                        isSignUp: true,
                    },
                },
            ],
        },
        {
            path: '/root',
            component: AuthorizedToolbar,
            meta: {
                requiredAuth: true,
            },
            children: [
                {
                    path: '',
                    redirect: '/UserList',
                },
                {
                    path: '/UserList',
                    component: UserList,
                    name: 'UserList',
                    meta: {
                        title: 'User list',
                    },
                },
                {
                    path: '/Profile',
                    component: Settings,
                    name: 'Profile',
                    meta: {
                        title: 'User list',
                    },
                },
            ],
        },
    ],
});

router.beforeEach(async (to, from, next) => {

    if (!store.state.authState) {
        await store.dispatch('getAuth');
    }

    let redirectParams = {};

    if (to.matched.some((route) => route.meta.requiredAuth)) {
        if (store.state.authState === AuthStates.SignedOut) {
            redirectParams = { path: '/' };
        }
    } else if (to.matched.some((route) => route.meta.requiredUnauth)) {
        if (store.state.authState === AuthStates.SignedIn) {
            redirectParams = { path: '/root' };
        }
    }
    next(redirectParams);
});


export default router;
