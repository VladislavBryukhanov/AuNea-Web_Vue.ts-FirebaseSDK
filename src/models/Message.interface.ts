export interface Message {
    content: string;
    dateOfSend: Date;
    read: boolean;
    to: string;
    who: string;
    fileMediaSides: string;
    fileType: string;
    fileUrl: string;
}
