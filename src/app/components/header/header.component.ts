import { Component, OnDestroy, OnInit } from '@angular/core';
import { JsonPipe, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    CommonModule,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  user?: User | undefined;

  canViewRegisterButton = false;
  canViewEditButton = false;
  canViewDeleteButton = false;


  isNavbarShown = document.querySelector('.navbar-collapse.show');
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router) {
    userService.profile$.subscribe({

      next: (user) => {
        this.user = user;
        this.updateButtonVisibility(); // Aggiorna la visibilità dei pulsanti
      }
    })
  }


  ngOnInit(): void {

  }
  //closenavBar
  closeNavBar() {
    const navbarCollapse = document.querySelector('#navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      return navbarCollapse.classList.remove('show');
    }
  }


  updateButtonVisibility(): void {
    if (this.user) {
      const visibility = this.userService.getButtonVisibility(this.user.role);
      this.canViewRegisterButton = visibility.canViewRegisterButton;
      this.canViewEditButton = visibility.canViewEditButton;
      this.canViewDeleteButton = visibility.canViewDeleteButton;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
