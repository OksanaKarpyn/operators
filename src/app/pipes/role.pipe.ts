import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';
import { Role } from '../models/user';

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {

  currentRole!: Role | undefined;

  constructor(private userService: UserService) {
    userService.profile$.subscribe({
      next: (user) => {
        this.currentRole = user?.role;
      }
    })
  }


  transform(allowedRoles: Role[]): boolean {

    if(this.currentRole){
// sel current role é admin  in teoria e  sempre true
      return allowedRoles.includes(this.currentRole);
    }
    return false;
  }
}
