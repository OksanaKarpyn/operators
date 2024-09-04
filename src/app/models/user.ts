export type Role =  'admin'|'operator'|'standard';

export interface User {
    id?:string;
    name: string;
    surname: string;
    role:Role;
    email:string;
    password:string;
}