import { MutationTree } from 'vuex';
import ChatState from '@/models/store/ChatState.interface';
import { Message } from '@/models/Message.interface';

const mutations: MutationTree<ChatState> = {
    getInterlocutor(state, interlocutor) {
        state.currentChat = {
            ...state.currentChat,
            interlocutor,
        };
    },
    getChat(state, { databaseRef }) {
        state.currentChat = {
            ...state.currentChat,
            databaseRef,
        };
    },
    getMessages(state, { messages }) {
        state.currentChat = {
            ...state.currentChat,
            messages: [ ...messages, ...state.currentChat.messages ]
        };
    },
    appendMessage(state, message) {
        state.currentChat = {
            ...state.currentChat,
            messages: [ ...state.currentChat.messages, message ]
        };
    },
    removeMessage(state, message) {
        state.currentChat = {
            ...state.currentChat,
            messages: state.currentChat.messages.filter(msg => msg.uid !== message.uid)
        };
    },
    disposeChat(state) {
        state.currentChat = {
            messages: [],
            interlocutor: null,
            databaseRef: null,
        };
    },
};
export default mutations;
