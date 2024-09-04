import { Component, OnInit } from '@angular/core';
import { JsonPipe,CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ThemeService } from '../../services/theme.service';
import { RolePipe } from '../../pipes/role.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    RouterModule,
    RouterLinkActive,
    CommonModule,
    RolePipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  
  user?: User |undefined;
  isDarkTheme = false;
  //---role---
  canRegister = false;
  canEdit = false;
  canView = false;

  constructor(
    private authService:AuthService,
    private userService:UserService,
    private themeService :ThemeService
  ){

    userService.profile$.subscribe({
        
      next:(user)=>{
        this.user = user;
        if(user){

          this.canRegister =  this.userService.hasRole1(['admin'])
          this.canEdit = this.userService.hasRole1(['admin','operator'])
        }
      }
    })
  }

  ngOnInit():void{     
    //-------role------

  //   this.userService.hasRole(['admin']).subscribe({
  //     next:(admin)=>{
  //       this.isAdmin= admin;
  //     },
  //     error:(err)=>{
  //       console.error(err);
  //       this.canEdit= false;
  //     }
  //   });
   
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
   //this.isAdmin = this.userService.hasRole1(['admin'])

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

