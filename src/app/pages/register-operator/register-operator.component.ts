import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
@Component({
  selector: 'app-register-operator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule

  ],
  templateUrl: './register-operator.component.html',
  styleUrls: ['./register-operator.component.scss']
})
export class RegisterOperatorComponent implements OnInit {
  form: FormGroup;
  userId!: string | null;
  currentRole = '';
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      role: [{ value: '', disabled: true }, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Ottieni l'ID dell'utente dalla rotta (se presente)
    this.userId = this.route.snapshot.paramMap.get('id');
    this.userService.profile$.subscribe(user => {
      if (user) {
        this.currentRole = user.role;
        if (this.userId) {
          this.isEditing = true;
          // Modalità di modifica: carica i dati dell'utente
          this.userService.getUserById(this.userId).subscribe(userData => {
            this.form.patchValue(userData);
          });
          // Disabilita il campo password durante l'editing
          this.form.get('password')?.clearValidators();
          this.form.get('password')?.updateValueAndValidity();
        }
        // Adatta la visibilità dei campi in base al ruolo
        this.userService.updateFormVisibility(this.form, this.currentRole);
      }
    });


  }

  submit(): void {
    if (this.form.valid) {
      if (this.userId) {
        // Modalità di modifica: aggiorna l'utente esistente
        const updatedUser: User = { ...this.form.value, id: this.userId };
        this.userService.updateUser(updatedUser).subscribe({
          next: () => {
            alert('User updated successfully');

            // Esegui una nuova richiesta GET per aggiornare i dati nel form
            this.userService.getUserById(this.userId!).subscribe({
              next: (updatedUserData: User) => {
                this.form.patchValue(updatedUserData);
              },
              error: (error) => {
                console.error('Error reloading user data:', error);
              }
            });
            this.router.navigate(['/users']);
          },
          error: (res) => {
            console.error('Error updating user:', res.error.message);
            alert('Error updating user.');
          }
        });
      } else {
        // Modalità di registrazione: crea un nuovo utente
        this.userService.register(this.form.value).subscribe({
          next: () => {
            alert('User registered successfully');
            this.router.navigate(['/users']);
          },
          error: (res) => {
            console.error('Error registering user:', res.error.message);
            alert('Error registering user.');
          }
        });
      }
    }
  }
}
