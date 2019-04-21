import {User} from '@/models/User.interface';
import {AuthStates} from '@/constants/auth';
import AuthState from '@/models/store/AuthState.interface';
import {MutationTree} from 'vuex';

const mutations: MutationTree<AuthState> = {
    getProfile(state, user: User) {
        state.authState = AuthStates.SignedIn;
        state.myAccount = user;
    },
    signOut(state) {
        state.myAccount = null;
        state.authState = AuthStates.SignedOut;
    },
    editProfile(state, changedUser) {
        state.myAccount = changedUser;
    },
};
export default mutations;
