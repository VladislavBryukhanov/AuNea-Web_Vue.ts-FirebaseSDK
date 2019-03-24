export class Message {
    private _content: string;
    private _dateOfSend: Date;
    private _read: boolean;
    private _to: string;
    private _who: string;
    private _fileMediaSides: string;
    private _fileType: string;
    private _fileUrl: string;


    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get dateOfSend(): Date {
        return this._dateOfSend;
    }

    set dateOfSend(value: Date) {
        this._dateOfSend = value;
    }

    get read(): boolean {
        return this._read;
    }

    set read(value: boolean) {
        this._read = value;
    }

    get to(): string {
        return this._to;
    }

    set to(value: string) {
        this._to = value;
    }

    get who(): string {
        return this._who;
    }

    set who(value: string) {
        this._who = value;
    }

    get fileMediaSides(): string {
        return this._fileMediaSides;
    }

    set fileMediaSides(value: string) {
        this._fileMediaSides = value;
    }

    get fileType(): string {
        return this._fileType;
    }

    set fileType(value: string) {
        this._fileType = value;
    }

    get fileUrl(): string {
        return this._fileUrl;
    }

    set fileUrl(value: string) {
        this._fileUrl = value;
    }
}