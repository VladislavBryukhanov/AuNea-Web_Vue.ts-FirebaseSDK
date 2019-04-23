import ChatState from '@/models/store/ChatState.interface';
import {Module} from 'vuex';
import RootState from '@/models/store/RootState.interface';
import mutations from '@/store/Chat/mutations';
import actions from '@/store/Chat/actions';

const namespaced = true;
export const state: ChatState = {
    currentChat: {
        messages: [],
        interlocutor: null,
        databaseRef: null,
    },
};

export const Chat: Module<ChatState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
};
