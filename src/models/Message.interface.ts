export interface Message {
    uid: string;
    content: string;
    timestamp: number;
    read: boolean;
    to: string;
    who: string;
    fileMediaSides: string;
    fileType: string;
    fileUrl: string;
}
