import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductAttribute } from '../models/product-attribute.model';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductAttributeService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/product-attributes';

  getAttributes(): Observable<ProductAttribute[]> {
    return this.http.get<ProductAttribute[]>(this.apiUrl);
  }

  getAttributeById(id: string): Observable<ProductAttribute> {
    return this.http.get<ProductAttribute>(`${this.apiUrl}/${id}`);
  }

  addAttribute(attribute: Omit<ProductAttribute, 'id'>): Observable<ProductAttribute> {
    return this.http.post<ProductAttribute>(this.apiUrl, attribute);
  }

  updateAttribute(attribute: ProductAttribute): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${attribute.id}`, attribute);
  }

  deleteAttribute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
