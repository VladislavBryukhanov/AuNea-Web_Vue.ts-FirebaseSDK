import {Message} from '@/models/Message';

export class Dialog {
    private _lastMessage: Message;
    private _notify: boolean;
    private _speakers: Map<string, string>;
    private _unreadCounter: number;

    constructor(lastMessage: Message, notify: boolean, speakers: Map<string, string>, unreadCounter: number) {
        this._lastMessage = lastMessage;
        this._notify = notify;
        this._speakers = speakers;
        this._unreadCounter = unreadCounter;
    }

    get lastMessage(): Message {
        return this._lastMessage;
    }

    set lastMessage(value: Message) {
        this._lastMessage = value;
    }

    get notify(): boolean {
        return this._notify;
    }

    set notify(value: boolean) {
        this._notify = value;
    }

    get speakers(): Map<string, string> {
        return this._speakers;
    }

    set speakers(value: Map<string, string>) {
        this._speakers = value;
    }

    get unreadCounter(): number {
        return this._unreadCounter;
    }

    set unreadCounter(value: number) {
        this._unreadCounter = value;
    }
}
