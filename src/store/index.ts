import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import {User} from '@/models/User.interface';
import {Dialog} from '@/models/Dialog.interface';
import {Message} from '@/models/Message.interface';
import {AuthStates} from '@/constants/auth';
import uuid from 'uuid';
import _ from 'lodash';
import moment from 'moment';
import Chat from "@/models/Chat.interface";

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
        interlocutor: null,

        users: [],
        dialogs: [],
        currentChat: {},
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
        getInterlocutor(state, interlocutor) {
            state.currentChat = {
                ...state.currentChat,
                interlocutor
            };
        },

        appendDialog(state, dialog: Dialog) {
            state.dialogs.push(dialog);
        },
        updateDialog(state, changedDialog) {
            const index = state.dialogs.findIndex(
                (item) => item.uid === changedDialog.uid);
            if (index !== -1) {
                const speaker = state.dialogs[index].speaker;
                state.dialogs.splice(index, 1, {
                    ...changedDialog,
                    speaker
                })
            }
        },
        updateDialogSpeaker(state, { uid, changedSpeaker }) {
            const index = state.dialogs.findIndex(
                (item) => item.uid === uid);
            if (index !== -1) {
                state.dialogs.splice(index, 1, {
                    ...state.dialogs[index],
                    speaker: changedSpeaker
                })
            }
        },
        getChat(state, {messages, databaseRef}) {
            state.currentChat = {
                ...state.currentChat,
                messages,
                databaseRef
            };
        }
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
                const user = await getUserByUid(auth.currentUser.uid);
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
        async getProfile({ state, commit }) {
            try {
                const user = await getUserByUid(auth.currentUser.uid);
                commit('getProfile', user);
                watchNetworkStatus(state.myAccount);
            } catch (err) {
                commit('snackbarShow', {message: 'Unauthorized', duration: 1500});
            }
        },
        signOut({ state, commit }) {

            state.myAccount.databaseRef
                .child('status')
                .set(`Last seen at ${moment().format('HH:mm DD MMM')}`);

            auth.signOut();
            commit('signOut');
        },

        async editProfile({ commit, state }, { changedUser, avatar }) {
            const { myAccount } = state;
            let fileUploading;
            const userRef = state.myAccount.databaseRef;

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
        },

        getUsers({ state, commit }) {
            const userRef = database.ref('/Users');
            userRef.once('value', (usersSnapshot) => {
                const users = [];
                usersSnapshot!.forEach((userSnap) => {
                    const user = userSnap.val();
                    if (user.uid !== state.myAccount.uid) {
                        users.push(user);
                    }
                });
                commit('getUsers', users);
            });
            userRef.on('child_changed', (userSnapshot) => {
                commit('changeUser', userSnapshot!.val());
            });
        },
        getDialogs({ state, commit }) {
            const myUid = auth.currentUser.uid;
            const dialogsRef = database
                .ref('/Dialogs')
                .orderByChild(`speakers/${myUid}`)
                .equalTo(myUid);

            dialogsRef.on('child_added', (dialogSnapshot) => {
                const dialog = {
                    uid: dialogSnapshot.key,
                    ...dialogSnapshot.val(),
                };

                _.forOwn(dialog.speakers,(speakerUid) => {
                    if (speakerUid !== auth.currentUser.uid) {

                        database
                            .ref('/Users')
                            .orderByChild('uid')
                            .equalTo(speakerUid)
                            .on('value', (userSnapshot) => {
                                userSnapshot.forEach((userSnap) => {
                                    dialog.speaker = userSnap!.val();

                                    if (state.dialogs.some(item => item.uid === dialog.uid)) {
                                        commit('updateDialogSpeaker', {
                                            uid: dialog.uid,
                                            changedSpeaker: userSnap!.val()
                                        });
                                    } else {
                                        commit('appendDialog', dialog);
                                    }
                                });
                            });
                    }
                });

            });
            dialogsRef.on('child_changed', (dialogSnapshot) => {
                const changedDialog = {
                    uid: dialogSnapshot!.key,
                    ...dialogSnapshot!.val(),
                };
                commit('updateDialog', changedDialog);
            });
        },
        async getInterlocutor({ commit }, chatId) {
            database
                .ref(`/Dialogs/${chatId}`)
                .once('value', async (chatSnapshot) => {

                    const { speakers } = chatSnapshot.val();

                    for (let speaker in speakers) {
                        if (speaker !== auth.currentUser.uid) {
                            const usersRef = database.ref('/Users');
                            usersRef
                                .orderByChild('uid')
                                .equalTo(speaker)
                                .on('value', (usersSnapshot) => {
                                    usersSnapshot.forEach(interlocutorSnap => {
                                        commit('getInterlocutor', {
                                            ...interlocutorSnap!.val(),
                                            databaseRef: usersRef.child(interlocutorSnap.key)
                                        });
                                    })
                                });
                        }
                    }
                });
        },
        async getChat({ commit }, chatId) {
            // FIXME
            const chatRef = database.ref(`/Messages/${chatId}`);

            chatRef.on('value', (chatSnapshot) => {
                const messages = [];
                chatSnapshot.forEach((messageSnap) => {
                    messages.push(messageSnap.val());
                });
                commit('getChat', {
                    messages,
                    databaseRef: chatRef
                });
            })
        },
        async sendMessage({ commit }, message: Message) {

        }
    },
});

const getUserByUid = (uid) => {
    return new Promise((resolve, reject) => {
        const usersRef = database.ref('/Users');

        usersRef
            .orderByChild('uid')
            .equalTo(uid)
            .once('child_added', (userSnapshot) => {
                resolve({
                    ...userSnapshot!.val(),
                    databaseRef: usersRef.child(userSnapshot.key)
                });
            });
    });
};

const watchNetworkStatus = (myAccount) => {
    database
        .ref('.info/connected')
        .on('value', (snapshot) => {

            if(snapshot.val()) {
                const myProfileRef = myAccount.databaseRef.child('status');

                myProfileRef.set('Online');
                myProfileRef
                    .onDisconnect()
                    .set(`Last seen at ${moment().format('HH:mm, DD MMM')}`);
            }
        });
};
