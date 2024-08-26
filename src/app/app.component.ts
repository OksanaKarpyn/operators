import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeService } from './services/theme.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    CommonModule,
    FooterComponent,
    SidebarComponent,

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  // `styleUrls` non `styleUrl`
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean>; 
  isDarkTheme: boolean = false;
  constructor(
    private authService: AuthService,
    private themeService:ThemeService
  ) {
    // Inizializza `isAuthenticated$` dal servizio di autenticazione
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }
  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme=>{
      this.isDarkTheme = theme === 'dark-theme';
      
    })
  }
}
