import DialogListState from '@/models/store/DialogListState.interface';
import RootState from '@/models/store/RootState.interface';
import {Module} from 'vuex';
import mutations from '@/store/DialogList/mutations';
import actions from '@/store/DialogList/actions';

const namespaced: boolean = true;
export const state: DialogListState = {
    dialogs: [],
};

export const DialogList: Module<DialogListState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
};
