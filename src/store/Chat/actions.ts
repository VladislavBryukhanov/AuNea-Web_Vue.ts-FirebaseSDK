import {ActionTree} from 'vuex';
import {Message} from '@/models/Message.interface';
import ChatState from '@/models/store/ChatState.interface';
import firebase from 'firebase';
import RootState from '@/models/store/RootState.interface';
import _ from 'lodash';
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
        const chatRef = database.ref(`/Messages/${chatId}`);
        commit('getChat', {
            databaseRef: chatRef,
        });

        let prevent_first_child_added = true;

/*        chatRef.on('child_changed', (messageSnapshot) => {
            commit('changedMessage', { ...messageSnapshot.val(), uid: messageSnapshot.key })
        });*/
        chatRef.on('child_removed', (messageSnapshot) => {
            // после удаления сразу же срабатывает адд ивент, т к он приасайнен к последнему айтему, а послдний айтем меняется
            prevent_first_child_added = !prevent_first_child_added;
            commit('removeMessage', { ...messageSnapshot.val(), uid: messageSnapshot.key })
        });
        chatRef.limitToLast(1).on('child_added', (messageSnapshot) => {
            if (prevent_first_child_added) {
                prevent_first_child_added = !prevent_first_child_added;
            } else {
                commit('appendMessage', { ...messageSnapshot.val(), uid: messageSnapshot.key })
            }
        });
    },

    async fetchMessages({ state, commit }, {chatId, limit}) {
        const chatRef = database.ref(`/Messages/${chatId}`);

        let query;

        if (_.isEmpty(state.currentChat.messages)) {
            query = chatRef
                .orderByKey()
                .startAt('')
                .limitToLast(limit);
        } else {
            query = chatRef
                .orderByKey()
                .endAt(state.currentChat.messages[0].uid)
                .limitToLast(limit);
        }

        return new Promise((resolve, reject) => {
            query.once('value', (chatSnapshot) => {
                const messages = [];
                chatSnapshot.forEach((messageSnap) => {
                    messages.push({...messageSnap.val(), uid: messageSnap.key});
                });
                commit('getMessages', {
                    messages,
                });
                resolve();
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
