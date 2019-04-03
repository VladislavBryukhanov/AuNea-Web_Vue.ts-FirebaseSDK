import {Message} from '@/models/Message.interface';
import {User} from "@/models/User.interface";

export interface Dialog {
    uid: string;
    lastMessage: Message;
    speaker: User;
    speakers: Map<string, string>;
    notify: boolean;
    unreadCounter: number;
}
