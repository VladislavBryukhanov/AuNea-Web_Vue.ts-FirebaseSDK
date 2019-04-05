export interface User {
    uid: string;
    login: string;
    nickname: string;
    bio: string;
    registrationToken: string;
    status: string;
    avatarUrl: string | ArrayBuffer;
    databaseRef: any;
}
