import {ActionTree} from 'vuex';
import UserListState from '@/models/store/UserListState.interface';
import firebase from 'firebase';
import RootState from '@/models/store/RootState.interface';
const database = firebase.database();

const actions: ActionTree<UserListState, RootState> = {
    getUsers({ commit, rootState }) {
        const userRef = database.ref('/Users');
        userRef.once('value', (usersSnapshot) => {
            const users = [];
            usersSnapshot!.forEach((userSnap) => {
                const user = userSnap.val();
                if (user.uid !== rootState.Auth.myAccount.uid) {
                    users.push(user);
                }
            });
            commit('getUsers', users);
        });
        userRef.on('child_changed', (userSnapshot) => {
            commit('changeUser', userSnapshot!.val());
        });
    },
};
export default actions;
