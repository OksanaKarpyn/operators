import { Component, OnInit } from '@angular/core';
import { JsonPipe,CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
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
    RouterModule,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  
  user?: User |undefined;
  isDarkTheme = false;

  constructor(
    private authService:AuthService,
    private userService:UserService,
    private themeService :ThemeService
  ){

    userService.profile$.subscribe({
        
      next:(user)=>{
        this.user = user;
      }
    })
  }

  ngOnInit():void{     
    
    //--------theme---------
    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark-theme';
    });
  

  }
  //------function-theme------
  toggleTheme(){
    const newTheme = this.isDarkTheme ? 'light-theme' : 'dark-theme';
    this.themeService.setTheme(newTheme);
  }

   logout(): void {
    this.authService.logout();
  }

}

