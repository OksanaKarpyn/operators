import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly url = 'http://localhost:3000/users';


  profile$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  register(user: User): Observable<void> {
    return this.http.post<void>(`${this.url}/register`, user, { withCredentials: true });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${user.id}`, user, { withCredentials: true });
  }

  deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.url}/${id}`, { withCredentials: true });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/all`);
  }

  //prende utente sulla base dell suo id
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return throwError(error); // o puoi restituire of(null) se preferisci
      })
    );
  }

  //prende utente loggato sulla base di cookies
  getCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.url}/profile`, { withCredentials: true }).pipe(tap((user) => {
      this.profile$.next(user);
    }));

  }

  updateFormVisibility(form: FormGroup, currentRole: string): void {

    if (currentRole === 'admin') {
      // Mostra tutto per admin
      form.get('role')?.enable();
      form.get('name')?.enable();
      form.get('surname')?.enable();
      form.get('email')?.enable();
      form.get('password')?.enable();
    } else if (currentRole === 'operator') {
      // Nascondi il campo role per l'administrator
      form.get('role')?.disable();
    } else {
      // Nascondi tutto per standard
      form.disable();
    }
  }

  getButtonVisibility(currentRole: string) {

    const visibility = {
      canViewRegisterButton: false,
      canViewEditButton: false,
      canViewDeleteButton: false

    }
    if (currentRole === 'admin') {
      visibility.canViewRegisterButton = true;
      visibility.canViewEditButton = true;
      visibility.canViewDeleteButton = true;

    } else if (currentRole === 'operator') {
      visibility.canViewRegisterButton = false;
      visibility.canViewEditButton = true;
      visibility.canViewDeleteButton = false;
    }
    return visibility;
  }

  canDeleteUser(id: string, currentUser?: User): boolean {
    if (currentUser && currentUser.role === 'admin') {
      return currentUser.id !== id; // L'admin può cancellare chiunque tranne se stesso
    }
    return false; // Gli altri utenti non possono cancellare nessuno
  }
}