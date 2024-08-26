import { Component, OnInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



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
export class LoginOperatorComponent implements OnInit{
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
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  submit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(response => {
        if (response != null && response.accessToken) {
          console.log('response',response);
          this.userService.profile$.next(response.user)
            if(response.user){
            // Reindirizza l'utente alla dashboard con l'ID nell'URL
                this.router.navigate([`/dashboard`]);
            }else{
            console.error('User ID not found in token');
            alert('Errore durante il login. Riprova.');
            this.router.navigate([`/login`]);
            }
        } else {
          // Operatore non trovato o credenziali errate
          alert('Email o password errati');
        }
      });
    }
  }
}
