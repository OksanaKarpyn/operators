import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operator } from '../models/operator';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
  readonly url = 'http://localhost:3000/operators';

  constructor(private http: HttpClient) {}


  getOperators():Observable<Array<Operator>>{
    return this.http.get<Array<Operator>>(this.url);
  }
  createUser(operator: Operator): Observable<Operator> {
    return this.http.post<Operator>(this.url, operator);
  }
  
}
