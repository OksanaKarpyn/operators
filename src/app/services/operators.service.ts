import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Operator } from '../models/operator';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
  readonly url = 'http://localhost:3000/operators';
  private currentOperatorKey = 'currentOperator';

  constructor(private http: HttpClient) {}

  getOperators(): Observable<Array<Operator>> {
    return this.http.get<Array<Operator>>(this.url);
  }

  createOperator(operator: Operator): Observable<Operator> {
    return this.http.post<Operator>(this.url, operator);
  }

  getOperatorByEmailAndPassword(email: string, password: string): Observable<Operator | null> {
    return this.http.get<Operator[]>(`${this.url}?email=${email}&password=${password}`).pipe(
      map(operators => operators.length ? operators[0] : null)
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.getOperatorByEmailAndPassword(email, password).pipe(
      map(operator => {
        if (operator) {
          localStorage.setItem(this.currentOperatorKey, JSON.stringify(operator));
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.currentOperatorKey);
  }

  getCurrentOperator(): Operator | null {
    const operatorJson = localStorage.getItem(this.currentOperatorKey);
    return operatorJson ? JSON.parse(operatorJson) : null;
  }

  getOperatorById(id: string): Observable<Operator | null> {
    return this.http.get<Operator>(`${this.url}/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  isAuthenticated(): boolean {
    return this.getCurrentOperator() !== null;
  }
}
