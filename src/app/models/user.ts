export interface User {
    id?:string;
    name: string;
    surname: string;
    role:'admin'|'operator'|'standard';
    email:string;
    password:string;
}