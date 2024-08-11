import { Component, OnDestroy, OnInit } from '@angular/core';
import { JsonPipe,CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
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

  constructor(
    private authService:AuthService,
    private userService:UserService,
    private router: Router) {
  }
  
  
  ngOnInit():void{
    this.isAuthenticated = this.userService.isAuthenticated();
    

    this.sub = this.userService.isAuthenticated$.subscribe((value) => {

      this.isAuthenticated = value;

      if (value) {
        this.userService.getCurrentUser().subscribe(user => {
          if (user) {
            this.userId= user.id// Memorizza l'ID dell'operatore loggato
          }
        });
      }
    })
        
  }
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['']);
  }

//  ngOnDestroy(): void {
//    this.sub.unsubscribe()
//  }

}
