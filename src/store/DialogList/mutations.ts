import DialogListState from '@/models/store/DialogListState.interface';
import {MutationTree} from 'vuex';
import {Dialog} from '@/models/Dialog.interface';

const mutations: MutationTree<DialogListState> = {
    appendDialog(state, dialog: Dialog) {
        state.dialogs.push(dialog);
    },
    updateDialog(state, changedDialog) {
        const index = state.dialogs.findIndex(
            (item) => item.uid === changedDialog.uid);
        if (index !== -1) {
            const speaker = state.dialogs[index].speaker;
            state.dialogs.splice(index, 1, {
                ...changedDialog,
                speaker,
            });
        }
    },
    updateDialogSpeaker(state, { uid, changedSpeaker }) {
        const index = state.dialogs.findIndex(
            (item) => item.uid === uid);
        if (index !== -1) {
            state.dialogs.splice(index, 1, {
                ...state.dialogs[index],
                speaker: changedSpeaker,
            });
        }
    },
};
export default mutations;
