import {Module} from 'vuex';
import RootState from '@/models/store/RootState.interface';
import AuthState from '@/models/store/AuthState.interface';
import mutations from '@/store/Auth/mutations';
import actions from '@/store/Auth/actions';

const namespaced: boolean = true;

export const state: AuthState = {
    myAccount: null,
    authState: null,
};

export const Auth: Module<AuthState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
};

