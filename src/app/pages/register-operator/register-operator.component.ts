import { Component } from '@angular/core';
import { OperatorsService } from '../../services/operators.service';

import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
@Component({
  selector: 'app-register-operator',
  standalone: true,
  imports: [ 
  ReactiveFormsModule,
  JsonPipe,
  CommonModule
  ],
  templateUrl: './register-operator.component.html',
  styleUrl: './register-operator.component.scss'
})
export class RegisterOperatorComponent {

  form!:UntypedFormGroup
  id!: string | null;

  constructor(
    private fb: FormBuilder,
    private operatorService: OperatorsService,
    private route: ActivatedRoute,
    private router: Router,
  ){
    this.form = this.fb.group({
      name:['',Validators.compose([Validators.required])],
      surname:['',Validators.compose([Validators.required])],
      email:['',Validators.compose([Validators.required,Validators.email])],
      password:['',Validators.compose([Validators.required])]


    })

  }



  //--------------------------------------------------------------

  submit(){
    if(this.form.invalid){
      return;
    }
    this.operatorService.createOperator(this.form.value).subscribe({
      next: (dataOperator) =>{
        console.log(dataOperator);
        this.router.navigate(['/dashboard-home'])
      }
    })
  }

}
