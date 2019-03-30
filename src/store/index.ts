import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import {User} from '@/models/User';
import {Dialog} from '@/models/Dialog';
import {Message} from '@/models/Message';
import {AuthStates} from '@/constants/auth';

Vue.use(Vuex);

const database = firebase.database();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
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
        snackbar: {
            message: '',
            duration: 500,
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
                duration,
            };
            console.log(message);
            console.log(duration);
            console.log(state.snackbar);
        },
        getProfile(state, user: User) {
            state.authState = AuthStates.SignedIn;
            state.myAccount = user;
        },
        signOut(state) {
            state.myAccount = null;
            state.authState = AuthStates.SignedOut;
        },

        getUsers(state, users: User[]) {
            state.users = users;
        },
        changeUser(state, changedUser: User) {
            const index = state.users.findIndex(
                (item) => item.uid === changedUser.uid);
            state.users.splice(index, 1, changedUser);
        },
    },
    actions: {
        async signIn({ dispatch }) {
            try {
                await auth.signInWithPopup(provider);
                await dispatch('getProfile');
            } catch (err) {
                console.error(err);
            }
        },
        async signUp({ commit, dispatch }) {
            try {
                await auth.signInWithPopup(provider);
                const user = await getUserBuUid(auth.currentUser.uid);
                if (user) {
                    commit('snackbarShow', {message: 'Such user already exists.', duration: 3000});
                    commit('signOut');
                } else {
                    // save new user to db e t c
                    await dispatch('getProfile');
                }
            } catch (err) {
                console.error(err);
            }
        },
        async getAuth({ commit, dispatch }) {
            return new Promise((resolve, reject) => {
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        await dispatch('getProfile');
                    } else {
                        commit('signOut');
                    }
                    resolve();
                });
            });
        },
        async getProfile({ commit }) {
            try {
                const user = await getUserBuUid(auth.currentUser.uid);
                commit('getProfile', user);
            } catch (err) {
                commit('snackbarShow', {message: 'Unauthorized', duration: 1500});
            }
        },
        signOut({ commit }) {
            auth.signOut();
            commit('signOut');
        },

        getUsers({ state, commit }) {
            database
                .ref('/Users')
                .once('value', (usersSnapshot) => {
                    const users = [];
                    usersSnapshot!.forEach((userSnap) => {
                        const user = userSnap.val();
                        if (user.uid !== state.myAccount.uid) {
                            users.push(user);
                        }
                    });
                    commit('getUsers', users);
            });
            database
                .ref('/Users')
                .on('child_changed', (userSnapshot) => {
                    commit('changeUser', userSnapshot!.val());
            });
        },
    },
});

const getUserBuUid = (uid) => {
    return new Promise((resolve, reject) => {
        database
            .ref('/Users')
            .orderByChild('uid')
            .equalTo(uid)
            .on('child_added', (userSnapshot) => {
                if (userSnapshot.exists()) {
                    resolve(userSnapshot!.val());
                } else {
                    reject();
                }
            });
    });
};
