import {ActionTree} from 'vuex';
import DialogListState from '@/models/store/DialogListState.interface';
import RootState from '@/models/store/RootState.interface';
import firebase from 'firebase';
const database = firebase.database();
import _ from 'lodash';

const actions: ActionTree<DialogListState, RootState> = {

    getDialogs({ state, commit, rootState }) {
        const myUid = rootState.Auth.myAccount.uid;
        const dialogsRef = database
            .ref('/Dialogs')
            .orderByChild(`speakers/${myUid}`)
            .equalTo(myUid);

        dialogsRef.on('child_added', (dialogSnapshot) => {
            const dialog = {
                uid: dialogSnapshot.key,
                ...dialogSnapshot.val(),
            };

            _.forOwn(dialog.speakers, (speakerUid) => {
                if (speakerUid !== rootState.Auth.myAccount.uid) {
                    database
                        .ref('/Users')
                        .orderByChild('uid')
                        .equalTo(speakerUid)
                        .on('value', (userSnapshot) => {
                            userSnapshot.forEach((userSnap) => {
                                dialog.speaker = userSnap!.val();

                                if (state.dialogs.some((item) => item.uid === dialog.uid)) {
                                    commit('updateDialogSpeaker', {
                                        uid: dialog.uid,
                                        changedSpeaker: userSnap!.val(),
                                    });
                                } else {
                                    commit('appendDialog', dialog);
                                }
                            });
                        });
                }
            });
        });
        dialogsRef.on('child_changed', (dialogSnapshot) => {
            const changedDialog = {
                uid: dialogSnapshot!.key,
                ...dialogSnapshot!.val(),
            };
            commit('updateDialog', changedDialog);
        });
    },
};
export default actions;
