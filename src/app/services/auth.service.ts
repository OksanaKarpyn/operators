import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../models/token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url = 'http://localhost:3000/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient,private cookieService: CookieService) {
    this.isAuthenticatedSubject.next(this.isAuthenticated());
  }

  register(operator: User): Observable<void> {
    return this.http.post<void>(`${this.url}/register`, operator, { withCredentials: true });
    
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
  this.cookieService.delete('token');
  this.isAuthenticatedSubject.next(false);
  }

 


  saveToken(token: string, expiresInDays: number = 1): void {
    this.cookieService.set('token', token, expiresInDays);
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
