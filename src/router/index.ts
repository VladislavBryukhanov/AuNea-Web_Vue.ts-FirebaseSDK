import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import {AuthStates} from '@/constants/auth';

Vue.use(Router);

const UnauthorizedToolbar = () => import('@/components/toolbars/UnauthorizedToolbar.vue');
const AuthorizedToolbar = () => import('@/components/toolbars/AuthorizedToolbar.vue');
const Sign = () => import('@/pages/Sign.vue');
const Settings = () => import('@/pages/Profile.vue');
const UserList = () => import('@/pages/UserList.vue');
const DialogList = () => import('@/pages/DialogList.vue');
const Chat = () => import('@/pages/Chat.vue');

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
                },
                {
                    path: '/DialogList',
                    component: DialogList,
                    name: 'DialogList',
                },
                {
                    path: '/Chat/:id',
                    component: Chat,
                    name: 'Chat',
                },
                {
                    path: '/Profile',
                    component: Settings,
                    name: 'Profile',
                },
            ],
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const { authState } = store.state.Auth;
    let redirectParams = {};

    if (!authState) {
        await store.dispatch('Auth/getAuth');
    }

    if (to.matched.some((route) => route.meta.requiredAuth)) {
        if (authState === AuthStates.SignedOut) {
            redirectParams = { path: '/' };
        }
    } else if (to.matched.some((route) => route.meta.requiredUnauth)) {
        if (authState === AuthStates.SignedIn) {
            redirectParams = { path: '/root' };
        }
    }
    next(redirectParams);
});


export default router;
