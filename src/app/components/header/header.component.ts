import { Component, OnDestroy, OnInit } from '@angular/core';
import { JsonPipe,CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [JsonPipe,RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  userId?: string | null = null;
  sub?: Subscription;
  user?: User |undefined;

  constructor(
    private authService:AuthService,
    private userService:UserService,
    private router: Router) {
      userService.profile$.subscribe({
        
        next:(user)=>{
          this.user = user;
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
          }
        });
      }
    })
        
  }
  logout(): void {
    this.authService.logout();
  }

 ngOnDestroy(): void {
   this.sub?.unsubscribe()
 }

}
