import {User} from '@/models/User.interface';
import {Message} from '@/models/Message.interface';

export default interface Chat {
    messages: Message[];
    interlocutor: User;
    databaseRef: any;
}
