import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Operator } from '../models/operator';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
  readonly url = 'http://localhost:3000';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient,private cookieService: CookieService) {}

  register(operator: Operator): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, operator, { withCredentials: true }).pipe(
      map(response => {
        if (response.accessToken) {
          this.isAuthenticatedSubject.next(true);
          return response;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error during registration:', error);
        return of(null);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, { email, password }, { withCredentials: true }).pipe(
      map(response => {
        if (response.accessToken) {
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
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentOperator(): Observable<Operator | null> {
    const token = this.getCookie('token');
    if (token) {
        const decodedToken = this.decodeToken(token);
        if (decodedToken && decodedToken.email) {
            return this.http.get<Operator[]>(`${this.url}/operators?email=${decodedToken.email}`, { withCredentials: true }).pipe(
                map(operators => operators.length ? operators[0] : null),
                catchError(error => {
                  console.error('Error fetching current operator:', error);
                  return of(null);
                })
            );
        }
    }
    return of(null);
  }


  saveToken(token: string, expiresInDays: number = 1): void {
    this.cookieService.set('token', token, expiresInDays);
  }
  //----------------------------------------
  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

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
