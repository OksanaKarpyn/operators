
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OperatorsService } from '../../services/operators.service';
import { Operator } from '../../models/operator';

@Component({
  selector: 'app-register-operator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './register-operator.component.html',
  styleUrls: ['./register-operator.component.scss']
})
export class RegisterOperatorComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private operatorService: OperatorsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      // Estrai i valori del modulo
      const { name, surname, email, password } = this.form.value;
      
      // Crea l'oggetto Operator con i dati del modulo
      const newOperator: Operator = { name, surname, email, password };
  
      // Passa l'oggetto Operator al servizio di registrazione
      this.operatorService.register(newOperator).subscribe({
        next: (res)=>{

          alert('sei registrato');
        },error:(res)=>{
          // debugger;
          console.error(res.error.message)
        }
      })
    }
  }
}
