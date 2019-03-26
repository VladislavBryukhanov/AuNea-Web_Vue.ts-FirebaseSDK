import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import {User} from '@/models/User';
import {Dialog} from '@/models/Dialog';
import {Message} from '@/models/Message';

Vue.use(Vuex);

const database = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('user is logged');
    } else {
        console.log('user is logged out');
    }
});
/*
const myAccount: User = null;
const users: User[] = [];
const messages: Message[] = [];
const dialogs: Dialog[] = [];
*/

// TODO replace logic to different blocks
export default new Vuex.Store({
    state: {
        myAccount: null,
        users: [],
        messages: [],
        dialogs: [],
    },
    getters: {
        isAuthenticated: () => !!auth.currentUser
    },
    mutations: {
        getProfile(state, user: User) {
            state.myAccount = user;
        },
        signOut(state) {
            state.myAccount = null;
            console.log(auth.currentUser);
            console.log(this.getters.isAuthenticated());
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
        async signIn({ dispatch }) {
            try {
                await auth.signInWithPopup(provider);
                console.log(auth.currentUser);
                dispatch('getProfile');
            } catch (err) {
                console.error(err);
            }
        },
        async signUp({ commit }) {
            try {
                await auth.signInWithPopup(provider);
                const user = await new Promise((resolve, reject) => getUser(resolve, reject));
                if (user) {
                    commit('getProfile', userSnapshot!.val());
                } else {
                    auth.signOut();
                    console.log('Unauthorized');
                }
            } catch (err) {
                console.error(err);
            }
        },
        getProfile({ commit }) {
            database.ref('/Users').orderByChild('uid').equalTo(auth.currentUser.uid)
                .on('value', (userSnapshot) => {
                    if (userSnapshot.exists()) {
                        commit('getProfile', userSnapshot!.val())
                    } else {
                        auth.signOut();
                        console.log('Unauthorized');
                    }
                });
        },
        signOut({ commit }) {
            auth.signOut();
            commit('signOut');
        },

        getUsers({ commit }) {
            database.ref('/Users').on('child_added', (userSnapshot) => {
                commit('getUsers', userSnapshot!.val());
            });
            database.ref('/Users').on('child_changed', (userSnapshot) => {
                commit('changeUser', userSnapshot!.val());
            });
        },
    },
});

const getUser = (resolve, reject) => {
    database
        .ref('/Users')
        .orderByChild('uid')
        .equalTo(auth.currentUser.uid)
        .on('value', (userSnapshot) => {
            if (!userSnapshot.exists()) {
                resolve(userSnapshot!.val());
            } else {
                reject();
            }
        });
};