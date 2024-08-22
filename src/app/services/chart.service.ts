import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/products';
import { SalesData } from '../models/salesdata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  readonly url = 'http://localhost:3000/sales';


  constructor( private http:HttpClient) { }
  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.url}/products`);
  }
  getSalesData(): Observable<SalesData[]> {
    return this.http.get<SalesData[]>(`${this.url}`, { withCredentials: true });
  }
  
}
