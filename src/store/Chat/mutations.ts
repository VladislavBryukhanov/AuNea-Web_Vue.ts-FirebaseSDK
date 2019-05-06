import { MutationTree } from 'vuex';
import ChatState from '@/models/store/ChatState.interface';
import { Message } from '@/models/Message.interface';
import _ from 'lodash';

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
    appendMessage(state, message: Message) {
        state.currentChat = {
            ...state.currentChat,
            messages: [ ...state.currentChat.messages, message ]
        };
    },
    changeMessage(state, message: Message) {
        let { messages } = state.currentChat;
        const index = _.findIndex(messages, { uid: message.uid });
        messages.splice(index, 1, message);

        state.currentChat = {
            ...state.currentChat,
            messages
        };
    },
    removeMessage(state, message: Message) {
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
