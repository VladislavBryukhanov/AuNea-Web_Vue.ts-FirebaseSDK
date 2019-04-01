import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import {User} from '@/models/User.interface';
import {Dialog} from '@/models/Dialog.interface';
import {Message} from '@/models/Message.interface';
import {AuthStates} from '@/constants/auth';
import uuid from 'uuid';
import _ from 'lodash';

Vue.use(Vuex);

const database = firebase.database();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
});
const storage = firebase.storage();

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
        },
        getProfile(state, user: User) {
            state.authState = AuthStates.SignedIn;
            state.myAccount = user;
        },
        signOut(state) {
            state.myAccount = null;
            state.authState = AuthStates.SignedOut;
        },
        editProfile(state, changedUser) {
            state.myAccount = changedUser;
        },

        getUsers(state, users: User[]) {
            state.users = users;
        },
        changeUser(state, changedUser: User) {
            const index = state.users.findIndex(
                (item) => item.uid === changedUser.uid);
            if (index !== -1) {
                state.users.splice(index, 1, changedUser);
            }
        },
    },
    actions: {
        async signIn({ commit, dispatch }) {
            try {
                await auth.signInWithPopup(provider);
                await dispatch('getProfile');
            } catch (err) {
                commit('snackbarShow', {message: err.message, duration: 6000});
                console.error(err);
            }
        },
        async signUp({ commit, dispatch }, login) {
            try {
                await auth.signInWithPopup(provider);
                const user = await getUserBuUid(auth.currentUser.uid);
                if (!user) {
                    const usersRef = database.ref('/Users').push();
                    const user = {
                        login,
                        uid: auth.currentUser.uid
                    };
                    usersRef.set(user);
                    await dispatch('getProfile');
                } else {
                    commit('signOut');
                    commit('snackbarShow', {message: 'Such user already exists.', duration: 3000});
                }
            } catch (err) {
                commit('snackbarShow', {message: err.message, duration: 6000});
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

        async editProfile({ commit, state }, { changedUser, avatar }) {

            let userRef = database.ref('/Users');

            return new Promise((resolve, reject) => {
                userRef
                    .orderByChild('uid')
                    .equalTo(auth.currentUser.uid)
                    .once('child_added', async (userSnapshot) => {

                        const { myAccount } = state;
                        let fileUploading;
                        userRef = userRef.child(`${userSnapshot.key}`);

                        _.each(changedUser, (value, key) => {
                            if (!_.isEqual(changedUser[key], myAccount[key])) {
                                if (key === 'avatarUrl') {
                                    const oldFileRef = storage.refFromURL(myAccount.avatarUrl);

                                    const extension = avatar.type.split('/')[1];
                                    const newFileRef = storage.ref().child(
                                        `${auth.currentUser.email}/Avatar/${uuid.v4()}.${extension}`);

                                    fileUploading = newFileRef.put(avatar)
                                        .then(() => newFileRef.getDownloadURL())
                                        .then(downloadUrl => {
                                            changedUser.avatarUrl = downloadUrl;
                                            userRef.child(key).set(downloadUrl);
                                            oldFileRef.delete()
                                                .catch(err => console.log(err));
                                        });
                                } else {
                                    userRef.child(key).set(value);
                                }
                            }
                        });

                        if (fileUploading) {
                            await fileUploading;
                        }
                        commit('editProfile', changedUser);
                        resolve();

                    });
            });
        },

    /*    watchNetworkStatus() {
            const userRef = database.ref('/Users');
            userRef
                .orderByChild('uid')
                .equalTo(auth.currentUser.uid)
                .once('child_added', (userSnapshot) => {
                    userRef
                        .child(`${userSnapshot.key}/status`)
                        .set('Online')
                });
        },
        unwatchNetworkStatus() {
            const userRef = database.ref('/Users');
            userRef
                .orderByChild('uid')
                .equalTo(auth.currentUser.uid)
                .once('child_added', (userSnapshot) => {
                    userRef
                        .child(`${userSnapshot.key}/status`)
                        .set('Offline')
                });
        },*/

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
                resolve(userSnapshot!.val());
            });
    });
};
