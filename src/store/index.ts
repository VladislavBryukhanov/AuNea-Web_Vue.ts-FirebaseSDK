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

const users: User[] = [];
const messages: Message[] = [];
const dialogs: Dialog[] = [];

export default new Vuex.Store({
    state: {
        users,
        messages,
        dialogs,
    },
    mutations: {
        signIn() {

        },
        signUp() {

        },
        getProfile() {

        },
        getUsers(state, user) {
            state.users.push(user);
        },
        changeUser(state, changedUser) {
            const index = state.users.findIndex(item => item.uid == changedUser.uid);
            state.users.splice(index, 1, changedUser);
        },
    },
    actions: {
        signIn({ commit }) {
            auth.signInWithPopup(provider)
                .then(result => {
                    console.log(result);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode);
                    console.log(errorMessage);
                });
        },
        signUp({ commit }) {

        },
        logOut({ commit }) {
            auth.signOut();
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
