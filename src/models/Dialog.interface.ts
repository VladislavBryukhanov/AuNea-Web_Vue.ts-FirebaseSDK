import {Message} from '@/models/Message.interface';

export interface Dialog {
    lastMessage: Message;
    notify: boolean;
    speakers: Map<string, string>;
    unreadCounter: number;
}
