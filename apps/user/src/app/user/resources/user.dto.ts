export class User {
    id: string;         // unique
    username: string;   // unique
    alias: string;      // not unique
    password: string;
    name: string;       // not unique
    email: string;      // not unique
    createdAt: number;
}