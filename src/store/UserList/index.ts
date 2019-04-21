import UserListState from '@/models/store/UserListState.interface';
import {Module} from 'vuex';
import RootState from '@/models/store/RootState.interface';
import actions from '@/store/UserList/actions';
import mutations from '@/store/UserList/mutations';

const namespaced: boolean = true;

export const state: UserListState = {
    users: [],
};

export const UserList: Module<UserListState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
};
