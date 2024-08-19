import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,CommonModule,FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  // `styleUrls` non `styleUrl`
})
export class AppComponent {
  isAuthenticated$: Observable<boolean>; 

  constructor(private authService: AuthService) {
    // Inizializza `isAuthenticated$` dal servizio di autenticazione
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }
}
