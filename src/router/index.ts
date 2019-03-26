import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const UnauthorizedToolbar = () => import('@/components/toolbars/UnauthorizedToolbar.vue');
const AuthorizedToolbar = () => import('@/components/toolbars/AuthorizedToolbar.vue');
const UserList = () => import('@/pages/UserList.vue');
const Sign = () => import('@/pages/Sign.vue');

const router = new Router ({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: UnauthorizedToolbar,
            meta: {
                requiredUnauth: true
            },
            children: [
                {
                    path: '',
                    name: 'SingIn',
                    component: Sign,
                },
                {
                    path: 'signUp',
                    name: 'SingUp',
                    component: Sign,
                    props: {
                        isSignUp: true,
                    }
                },
            ]
        },
        {
            path: '/root',
            component: AuthorizedToolbar,
            meta: {
                requiredAuth: true
            },
            children: [
                {
                    path: '/UserList',
                    component: UserList,
                    name: 'UserList',
                    meta: {
                        title: 'User list'
                    },
                },
            ]
        }
    ],
});

// TODO accessCondition = requiredAuth, requiredUnauth, public
router.beforeEach((to, from, next) => {

    const isAuthenticated = store.getters.isAuthenticated;
    let redirectParams = {};

    if (to.matched.some(route => route.meta.requiredAuth)) {
        if (!isAuthenticated) {
            redirectParams = { path: '/' }
        }
    } else if (to.matched.some(route => route.meta.requiredUnauth)) {
        if (isAuthenticated) {
            redirectParams = { path: '/root' }
        }
    }
    next(redirectParams);
});


export default router;