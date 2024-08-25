import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../models/token';
import { UserService } from './user.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url = 'http://localhost:3000/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();



  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router) {
    this.isAuthenticatedSubject.next(this.isAuthenticated());
  }

  login(email: string, password: string): Observable<Token | null> {
    return this.http.post<any>(`${this.url}/login`, { email, password }, { withCredentials: true }).pipe(
      map((response: Token) => {
        if (response.accessToken) {
          this.saveToken(response.accessToken);
          this.isAuthenticatedSubject.next(true);
          return response;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return of(null);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.url}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.finalizeLogout();
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.cookieService.delete('token');
        this.isAuthenticatedSubject.next(false);
        window.location.reload();
      }
    });
  }

  finalizeLogout() {
    this.cookieService.delete('token');
    this.userService.profile$.next(undefined);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
  // logout(): void {
  // this.userService.profile$.next(undefined);  
  // this.cookieService.delete('token','');         
  // this.isAuthenticatedSubject.next(false);    
  // this.router.navigate(['']); 
  // }




  saveToken(token: string): void {
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);
    this.cookieService.set('token', token, expireDate);
  }


  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
  //----------------------------------------

  private getCookie(name: string): string | null {
    const nameLenPlus = (name.length + 1);
    return document.cookie
      .split(';')
      .map(c => c.trim())
      .filter(cookie => cookie.substring(0, nameLenPlus) === `${name}=`)
      .map(cookie => decodeURIComponent(cookie.substring(nameLenPlus)))[0] || null;
  }

  public isAuthenticated(): boolean {
    return !!this.getCookie('token');
  }
}
