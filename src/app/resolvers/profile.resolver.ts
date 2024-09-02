import { ResolveFn } from "@angular/router";
import { User } from "../models/user";
import { inject } from "@angular/core";
import { UserService } from "../services/user.service";
//ResolverFn func x fornire i dati
export const ProfileResolver:ResolveFn<User | undefined> = () =>{
    //inject->serve p ottenere instanza del userservice
    const service = inject(UserService);

   // grazie inject riesco ad acedere ai dati del getcurrentuser(profile);
    return service.getCurrentUser();
}