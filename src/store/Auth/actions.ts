import firebase from 'firebase';
import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid';
import {ActionTree} from 'vuex';
import RootState from '@/models/store/RootState.interface';
import AuthState from '@/models/store/AuthState.interface';
const database = firebase.database();
const messaging = firebase.messaging();
const storage = firebase.storage();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
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
                    databaseRef: usersRef.child(userSnapshot.key),
                });
            });
    });
};

const watchNetworkStatus = (myAccount) => {
    database
        .ref('.info/connected')
        .on('value', (snapshot) => {

            if (snapshot.val()) {
                const myProfileRef = myAccount.databaseRef.child('status');

                myProfileRef.set('Online');
                myProfileRef
                    .onDisconnect()
                    .set(`Last seen at ${moment().format('HH:mm, DD MMM')}`);
            }
        });
};

const initNotificationService = async () => {

    await messaging.requestPermission();
    saveNotificationToken();

    messaging.onTokenRefresh(() => {
        saveNotificationToken();
    });

    messaging.onMessage((msg) => {
        const { sender, content, tag } = msg.data;
        const senderUser = JSON.parse(sender);

        if (senderUser.uid === auth.currentUser.uid) { return; }

        const notificationTitle = senderUser.login;
        const notificationOptions = {
            tag,
            renotify: true,
            body: content,
            icon: senderUser.avatarUrl,
        };
        new Notification(notificationTitle, notificationOptions);
    });
};

const saveNotificationToken = () => {
    const usersRef = database.ref('/Users');
    usersRef
        .orderByChild('uid')
        .equalTo(auth.currentUser.uid)
        .once('child_added', async (userSnapshot) => {
            const newToken = await messaging.getToken();
            const currentToken = userSnapshot.child('webNotificationToken').val();

            if (newToken !== currentToken) {
                usersRef
                    .child(`${userSnapshot.key}/webNotificationToken`)
                    .set(newToken);
            }
        });
};

const actions: ActionTree<AuthState, RootState> = {

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
                usersRef.set({
                    login,
                    uid: auth.currentUser.uid,
                });
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
            await initNotificationService();
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
                        .then((downloadUrl) => {
                            changedUser.avatarUrl = downloadUrl;
                            userRef.child(key).set(downloadUrl);
                            oldFileRef.delete()
                                .catch((err) => console.log(err));
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
};

export default actions;
