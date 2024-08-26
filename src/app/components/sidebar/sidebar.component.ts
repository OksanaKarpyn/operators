import { Component, OnDestroy, OnInit } from '@angular/core';
import { JsonPipe,CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isAuthenticated = false;
  userId?: string | null = null;
  sub?: Subscription;
  user?: User |undefined;
  isDarkTheme: boolean = false;


  canViewRegisterButton: boolean = false;
  canViewEditButton: boolean = false;
  canViewDeleteButton : boolean = false;

  constructor(
    private authService:AuthService,
    private userService:UserService,
    private themeService :ThemeService
  ){
    userService.profile$.subscribe({
        
      next:(user)=>{
        this.user = user;
        this.updateButtonVisibility(); // Aggiorna la visibilità dei pulsanti
      }
    })
  }

  ngOnInit():void{
    this.isAuthenticated = this.userService.isAuthenticated();
    this.sub = this.userService.isAuthenticated$.subscribe((value) => {

      this.isAuthenticated = value;

      if (value) {
        this.userService.getCurrentUser().subscribe(user => {
          if (user) {
            console.log(user.id,'header component');
            this.userId= user.id// Memorizza l'ID dell'operatore loggato
            this.updateButtonVisibility(); // Aggiorna la visibilità dei pulsanti
          }
        });
      }
    })
     
    
    //--------theme---------
    const savedTheme = this.themeService.getTheme();
    this.isDarkTheme = savedTheme === 'dark-theme';
    this.themeService.setTheme(savedTheme);
  

  }
  //------function-theme------
  toggleTheme(){
    this.isDarkTheme = !this.isDarkTheme;
    const newTheme = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    this.themeService.setTheme(newTheme);
  }
  //------------------------------
  updateButtonVisibility():void {
    if(this.user){
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

