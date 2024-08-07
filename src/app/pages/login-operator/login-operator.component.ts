import { Component } from '@angular/core';
import { OperatorsService } from '../../services/operators.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-login-operator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login-operator.component.html',
  styleUrls: ['./login-operator.component.scss']
})
export class LoginOperatorComponent {
  loginForm!: UntypedFormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private operatorsService: OperatorsService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.operatorsService.login(email, password).subscribe(success => {
        if (success) {
          const operator = this.operatorsService.getCurrentOperator();
          if (operator && operator.id) {
            console.log(operator.id);
            // Naviga alla dashboard dell'operatore
            this.router.navigate([`/dashboard`, operator.id]);
          } else {
            // Questo caso non dovrebbe accadere, ma è meglio gestirlo
            alert('Si è verificato un errore durante il login. Riprovare.');
          }
        } else {
          // Operatore non trovato o credenziali errate
          alert('Email o password errati');
        }
      });
    }
  }
}
