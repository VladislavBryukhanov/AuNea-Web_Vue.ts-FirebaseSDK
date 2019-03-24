export class User {
    private _login: string;
    private _nickname: string;
    private _registrationToken: string;
    private _status: string;
    private _uid: string;
    private _avatarUrl: string;

    constructor(login: string, nickname: string, registrationToken: string, status: string, uid: string, avatarUrl: string) {
        this._login = login;
        this._nickname = nickname;
        this._registrationToken = registrationToken;
        this._status = status;
        this._uid = uid;
        this._avatarUrl = avatarUrl;
    }

    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }

    get nickname(): string {
        return this._nickname;
    }

    set nickname(value: string) {
        this._nickname = value;
    }

    get registrationToken(): string {
        return this._registrationToken;
    }

    set registrationToken(value: string) {
        this._registrationToken = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get uid(): string {
        return this._uid;
    }

    set uid(value: string) {
        this._uid = value;
    }

    get avatarUrl(): string {
        return this._avatarUrl;
    }

    set avatarUrl(value: string) {
        this._avatarUrl = value;
    }
}
