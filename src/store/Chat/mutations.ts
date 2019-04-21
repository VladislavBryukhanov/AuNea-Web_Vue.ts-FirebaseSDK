import {MutationTree} from 'vuex';
import ChatState from '@/models/store/ChatState.interface';

const mutations: MutationTree<ChatState> = {
    getInterlocutor(state, interlocutor) {
        state.currentChat = {
            ...state.currentChat,
            interlocutor,
        };
    },
    getChat(state, {messages, databaseRef}) {
        state.currentChat = {
            ...state.currentChat,
            messages,
            databaseRef,
        };
    },
    disposeChat(state) {
        state.currentChat = null;
    },
};
export default mutations;
