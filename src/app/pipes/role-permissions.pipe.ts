import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleVisibility',
  standalone: true
})
export class RoleVisibilityPipe implements PipeTransform {
  transform(userRole: string | undefined, allowedRoles: string[]): boolean {
    
    if (!userRole) {
      return false;
    }
    return allowedRoles.includes(userRole);
  }
}
