import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OperatorsService } from '../../services/operators.service';
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
export class LoginOperatorComponent {
  loginForm!: UntypedFormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private operatorsService: OperatorsService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.operatorsService.login(email, password).subscribe(response => {
        if (response != null && response.accessToken) {
          console.log(response.accessToken);
              // Salva il token 
           this.operatorsService.saveToken(response.accessToken);
        // Reindirizza l'utente alla dashboard

        const operatorId = response.userId;
        this.router.navigate([`/dashboard/${operatorId}`]);

        } else {
          // Operatore non trovato o credenziali errate
          alert('Email o password errati');
        }
      });
    }
  }
}
