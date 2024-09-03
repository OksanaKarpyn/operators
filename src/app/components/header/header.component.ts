import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { RolePipe } from '../../pipes/role.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    RolePipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  user?: User | undefined;
  //----role----
  isAdmin = false;
  canEdit = false;

  isNavbarShown = document.querySelector('.navbar-collapse.show');
  constructor(
    private authService: AuthService,
    private userService: UserService,
   ) {
    userService.profile$.subscribe({

      next: (user) => {
        this.user = user;
      }
    })
  }
ngOnInit(){
     //-------role------

    //  this.userService.hasRole(['admin']).subscribe({
    //   next:(admin)=>{
    //     this.isAdmin= admin;
    //   },
    //   error:(err)=>{
    //     console.error(err);
    //     this.canEdit= false;
    //   }
    // });
   
  // this.userService.hasRole(['admin','operator']).subscribe({
  //   next:(canEdit)=>{
  //     this.canEdit= canEdit;
  //   },
  //   error:(err)=>{
  //     console.error(err);
  //     this.canEdit= false;
  //   }
  // }); 

  
  // this.canEdit = this.userService.hasRole1(['admin','operator'])
  // this.isAdmin = this.userService.hasRole1(['admin'])

}

  //closenavBar
  closeNavBar() {
    const navbarCollapse = document.querySelector('#navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      return navbarCollapse.classList.remove('show');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
