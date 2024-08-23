import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // Se l'utente è autenticato, redirigi alla dashboard
      this.router.navigate(['/dashboard']);
      return false; // Non consenti l'accesso alla pagina di login
    }
    return true; // Permetti l'accesso alla pagina di login se non autenticato
  }
}
