// import { Component } from '@angular/core';
// import { OperatorsService } from '../../services/operators.service';
// import { RouterLink } from '@angular/router';
// import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule, JsonPipe } from '@angular/common';
// import { Operator } from '../../models/operator';
// @Component({
//   selector: 'app-register-operator',
//   standalone: true,
//   imports: [ 
//   ReactiveFormsModule,
//   JsonPipe,
//   CommonModule,
//   RouterLink
//   ],
//   templateUrl: './register-operator.component.html',
//   styleUrl: './register-operator.component.scss'
// })
// export class RegisterOperatorComponent {

//   form!:UntypedFormGroup
//   id!: string | null;

//   constructor(
//     private fb: FormBuilder,
//     private operatorService: OperatorsService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ){
//     this.form = this.fb.group({
//       name:['',Validators.compose([Validators.required])],
//       surname:['',Validators.compose([Validators.required])],
//       email:['',Validators.compose([Validators.required,Validators.email])],
//       password:['',Validators.compose([Validators.required])]


//     })

//   }



//   //--------------------------------------------------------------

//   submit(): void {
//     if (this.form.valid) {
//       const { name, surname, email, password } = this.form.value;
//       const newOperator: Operator = { name, surname, email, password };

//       this.operatorService.createOperator(newOperator).subscribe(operator => {
//         if (operator) {
//           // Dopo la creazione dell'operatore, lo salviamo nel local storage e reindirizziamo alla dashboard
//           localStorage.setItem('currentOperator', JSON.stringify(operator.id));
//           this.router.navigate([`/dashboard/${operator.id}`]);
//         } else {
//           // Se c'è un problema nella creazione, mostriamo un messaggio di errore
//           alert('Si è verificato un errore durante la registrazione. Riprovare.');
//         }
//       });
//     }
//   }

// }



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
      this.operatorService.register(newOperator).subscribe(response => {
        if (response) {
          console.log('Registration successful:', response);
          const operatorId = response.operatorId; // Assicurati che la risposta contenga l'ID dell'operatore
          // Reindirizza alla dashboard dell'operatore
          this.router.navigate([`/dashboard/${operatorId}`]);
        } else {
          // Se c'è un problema nella registrazione, mostriamo un messaggio di errore
          alert('Si è verificato un errore durante la registrazione. Riprovare.');
        }
      });
    }
  }
}
