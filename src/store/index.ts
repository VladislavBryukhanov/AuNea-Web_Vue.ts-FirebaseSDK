import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import {User} from '@/models/User';
import {Dialog} from '@/models/Dialog';
import {Message} from '@/models/Message';
import {AuthStates} from "@/constants/auth";

Vue.use(Vuex);

const database = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

/*
const myAccount: User = null;
const users: User[] = [];
const messages: Message[] = [];
const dialogs: Dialog[] = [];
*/

// TODO replace logic to different blocks
export default new Vuex.Store({
    state: {
        snackbar: {
            message: '',
            duration: 500
        },

        myAccount: null,
        authState: null,

        users: [],
        messages: [],
        dialogs: [],
    },
    // getters: {
    //     isAuthenticated: () => !!auth.currentUser
    // },
    mutations: {
        snackbarShow(state, {message, duration}) {
            state.snackbar = {
                message,
                duration
            }
            console.log(message);
            console.log(duration);
            console.log(state.snackbar);
        },
        signIn(state) {
            state.authState = AuthStates.SignedIn;
        },
        getProfile(state, user: User) {
            state.myAccount = user;
        },
        signOut(state) {
            state.myAccount = null;
            state.authState = AuthStates.SignedOut;
            // console.log(auth.currentUser);
            // console.log(this.getters.isAuthenticated());
        },
        getUsers(state, user: User) {
            state.users.push(user);
        },
        changeUser(state, changedUser: User) {
            const index = state.users.findIndex(item => item.uid == changedUser.uid);
            state.users.splice(index, 1, changedUser);
        },
    },
    actions: {
        async signIn({ commit }) {
            try {
                const authUser = await auth.signInWithPopup(provider);
                if (authUser) {
                    commit('signIn');
                }
            } catch (err) {
                console.error(err);
            }
        },
        async signUp({ commit }) {
            try {
                const authUser = await auth.signInWithPopup(provider);
                const user = await getUser(auth.currentUser.uid);
                if (user) {
                    commit('snackbarShow', {message: 'Such user already exists.', duration: 3000});
                    commit('signOut');
                } else {
                    // save new user to db e t c
                    if (authUser) {
                        commit('signIn');
                    }
                }
            } catch (err) {
                console.error(err);
            }
        },
        async getAuth({ commit }) {
            return new Promise((resolve, reject) => {
                auth.onAuthStateChanged((user) => {
                    if (user) {
                        commit('signIn');
                    } else {
                        commit('signOut');
                    }
                    resolve();
                });
            });
        },
        async getProfile({ commit }) {
            try {
                const user = await getUser(auth.currentUser.uid);
                commit('getProfile', user);
            } catch(err) {
                commit('snackbarShow', {message: 'Unauthorized', duration: 1500});
                auth.signOut();
            }
        },
        signOut({ commit }) {
            auth.signOut();
            commit('signOut');
        },

        getUsers({ commit }) {
            database
                .ref('/Users')
                .on('child_added', (userSnapshot) => {
                commit('getUsers', userSnapshot!.val());
            });
            database
                .ref('/Users')
                .on('child_changed', (userSnapshot) => {
                commit('changeUser', userSnapshot!.val());
            });
        },
    },
});

const getUser = (uid) => {
    return new Promise((resolve, reject) => {
        database
            .ref('/Users')
            .orderByChild('uid')
            .equalTo(uid)
            .on('value', (userSnapshot) => {
                if (userSnapshot.exists()) {
                    resolve(userSnapshot!.val());
                } else {
                    reject();
                }
            });
    });
};
