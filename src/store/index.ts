import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import {User} from '@/models/User';
import {Dialog} from '@/models/Dialog';
import {Message} from '@/models/Message';

Vue.use(Vuex);

const database = firebase.database();

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
        getUsers(state, user) {
            state.users.push(user);
        },
        changeUser(state, changedUser) {
            const index = state.users.findIndex(item => item.uid == changedUser.uid);
            state.users.splice(index, 1, changedUser);
        },
    },
    actions: {
        getUsers({ commit}) {
            database.ref('/Users').on('child_added', (userSnapshot) => {
                commit('getUsers', userSnapshot!.val());
            });
            database.ref('/Users').on('child_changed', (userSnapshot) => {
                commit('changeUser', userSnapshot!.val());
            });
        },
    },
});
