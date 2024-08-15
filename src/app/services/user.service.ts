import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../models/token';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly url = 'http://localhost:3000/users';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient,private cookieService: CookieService) {}

  register(user: User): Observable<void> {
    return this.http.post<void>(`${this.url}/register`, user, { withCredentials: true });
    
  }
  updateUser(user:User):Observable<User> {
    return this.http.put<User>(`${this.url}/${user.id}`,user,{ withCredentials: true });
  }
  deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.url}/${id}`,{ withCredentials: true });
  }
 

  

  getAllUsers(): Observable<Array<User>>{
    return this.http.get<Array<User>>(`${this.url}/all`);
  }
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.url}/${userId}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return throwError(error); // o puoi restituire of(null) se preferisci
      })
    );
  }
  

  getCurrentUser(): Observable<User | null> {
    const token = this.getCookie('token');
    if (token) {
        const decodedToken = this.decodeToken(token);
        if (decodedToken && decodedToken.email) {
            return this.http.get<User[]>(`${this.url}?email=${decodedToken.email}`, { withCredentials: true }).pipe(
                map(user => user.length ? user[0] : null),
                catchError(error => {
                  console.error('Error fetching current operator:', error);
                  return of(null);
                })
            );
        }
    }
    return of(null);
  }

  //----------------------------------------
 decodeToken(token: string): any {
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
