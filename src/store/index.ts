import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import firebase from 'firebase';
import { Message } from '@/models/Message.interface';
import RootState from '@/models/store/RootState.interface';
import { Auth } from '@/store/Auth';
import { UserList } from '@/store/UserList';
import { DialogList } from '@/store/DialogList';
import { Chat } from '@/store/Chat';

const database = firebase.database();

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
    state: {
        snackbar: {
            message: '',
            duration: 500,
        },
        Auth: null,
        UserList: null,
        DialogList: null,
        Chat: null,
    },

    modules: {
        Auth,
        UserList,
        DialogList,
        Chat,
    },

    mutations: {
        snackbarShow(state, {message, duration}) {
            state.snackbar = {
                message,
                duration,
            };
        },
    },
};
export default new Vuex.Store<RootState>(store);
