import {ActionTree} from 'vuex';
import {Message} from '@/models/Message.interface';
import ChatState from '@/models/store/ChatState.interface';
import firebase from 'firebase';
import RootState from '@/models/store/RootState.interface';
const database = firebase.database();

const actions: ActionTree<ChatState, RootState> = {
    async getInterlocutor({ commit, rootState }, chatId) {
        database
            .ref(`/Dialogs/${chatId}`)
            .once('value', async (chatSnapshot) => {

                const { speakers } = chatSnapshot.val();

                for (const speaker in speakers) {
                    if (speaker !== rootState.Auth.myAccount.uid) {
                        const usersRef = database.ref('/Users');
                        usersRef
                            .orderByChild('uid')
                            .equalTo(speaker)
                            .on('value', (usersSnapshot) => {
                                usersSnapshot.forEach((interlocutorSnap) => {
                                    commit('getInterlocutor', {
                                        ...interlocutorSnap!.val(),
                                        databaseRef: usersRef.child(interlocutorSnap.key),
                                    });
                                });
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
                messages.push({...messageSnap.val(), uid: messageSnap.key});
            });
            commit('getChat', {
                messages,
                databaseRef: chatRef,
            });
        });
    },

    async disposeChat({ state, commit }) {
        state.currentChat.databaseRef.off();
        state.currentChat.interlocutor.databaseRef.off();
        commit('disposeChat');
    },

    sendMessage({ state }, message: Message) {
        const { databaseRef } = state.currentChat;
        databaseRef.push().set(message);
    },

    deleteMessage({ state }, uid) {
        const { databaseRef } = state.currentChat;
        databaseRef.child(uid).remove();
    },

    sendFile({ state }, uid) {

    },
};
export default actions;
