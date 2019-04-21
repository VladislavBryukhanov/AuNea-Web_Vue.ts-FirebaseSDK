import AuthState from '@/models/store/AuthState.interface';
import UserListState from '@/models/store/UserListState.interface';
import DialogListState from '@/models/store/DialogListState.interface';
import ChatState from '@/models/store/ChatState.interface';

export default interface RootState {
    snackbar: object;
    Auth: AuthState;
    UserList: UserListState;
    DialogList: DialogListState;
    Chat: ChatState;
}
