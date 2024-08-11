
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

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
    private operatorService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
   
      // Passa l'oggetto Operator al servizio di registrazione
      this.userService.register(this.form.value).subscribe({
        next: (res)=>{

          alert('sei registrato');
          this.router.navigate(['/login']);
        },error:(res)=>{
          // debugger;
          console.error(res.error.message)
        }
      })
    
  }
}
