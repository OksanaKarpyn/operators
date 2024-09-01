import { ResolveFn } from "@angular/router";
import { User } from "../models/user";
import { inject } from "@angular/core";
import { UserService } from "../services/user.service";

export const ProfileResolver:ResolveFn<User | undefined> = () =>{
    const service = inject(UserService);


    return service.getCurrentUser();
}