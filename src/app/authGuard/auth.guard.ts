// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { OperatorsService } from '../services/operators.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private operatorsService: OperatorsService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.operatorsService.isAuthenticated()) {
//       return true;
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }
