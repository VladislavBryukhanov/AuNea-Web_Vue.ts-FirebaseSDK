import {MutationTree} from 'vuex';
import UserListState from '@/models/store/UserListState.interface';
import {User} from '@/models/User.interface';

const mutations: MutationTree<UserListState> = {
    getUsers(state, users: User[]) {
        state.users = users;
    },
    changeUser(state, changedUser: User) {
        const index = state.users.findIndex(
            (item) => item.uid === changedUser.uid);
        if (index !== -1) {
            state.users.splice(index, 1, changedUser);
        }
    },
};
export default mutations;
