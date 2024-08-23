import { User } from "./user";

export interface Token {
    accessToken: string;
    user?:User
}