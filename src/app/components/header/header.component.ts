import { Component } from '@angular/core';
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
export class HeaderComponent{

  user?: User | undefined;


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
