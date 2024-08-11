import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { window } from 'rxjs';
import { User } from '../../models/user';


@Component({
  selector: 'app-login-operator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login-operator.component.html',
  styleUrls: ['./login-operator.component.scss']
})
export class LoginOperatorComponent {
  loginForm!: UntypedFormGroup;
  userId?: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(response => {
        if (response != null && response.accessToken) {
          console.log(response);
              // Salva il token 
           this.authService.saveToken(response.accessToken);
         // Decodifica il token per ottenere l'ID utente
        const decodedToken = this.userService.decodeToken(response.accessToken);
        const userId = decodedToken?.id; // Assumendo che l'ID utente sia contenuto nel token

        if (userId) {
          // Reindirizza l'utente alla dashboard con l'ID nell'URL
          this.router.navigate([`/dashboard/${userId}`]);
        } else {
          console.error('User ID not found in token');
          alert('Errore durante il login. Riprova.');
        }
          //  this.userService.getCurrentUser().subscribe(user => {
          //   if (user) {
          //     this.userId = user.id// Memorizza l'ID dell'operatore loggato
          //   }
          // });
        // Reindirizza l'utente alla dashboard
        // this.router.navigate([`/dashboard/${this.userId}`]);
        

        } else {
          // Operatore non trovato o credenziali errate
          alert('Email o password errati');
        }
      });
    }
  }
}
