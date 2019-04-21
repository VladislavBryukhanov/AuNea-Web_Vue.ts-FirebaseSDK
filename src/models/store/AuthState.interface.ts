import {AuthStates} from '@/constants/auth';
import {User} from '@/models/User.interface';

export default interface AuthState {
    authState: AuthStates;
    myAccount: User;
}
