import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaxClass, TaxClassCreatePayload, TaxClassUpdatePayload } from '../models/tax-class.model';
import { environment } from '../../environments/environment.development';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';

@Injectable({ providedIn: 'root' })
export class TaxClassService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.ApiUrl}/tax/classes`;

  getTaxClasses(params?: SmartTableParam): Observable<SmartTableResult<TaxClass>> {
    return this.http.post<any>(`${this.apiUrl}/grid`, params || {}).pipe(
      map(response => ({
        data: response.items,
        total: response.totalRecord
      }))
    );
  }

  getTaxClassById(id: string): Observable<TaxClass> {
    return this.http.get<TaxClass>(`${this.apiUrl}/${id}`);
  }

  getTaxClassList(): Observable<TaxClass[]> {
    return this.http.get<TaxClass[]>(this.apiUrl);
  }

  addTaxClass(payload: TaxClassCreatePayload): Observable<TaxClass> {
    return this.http.post<TaxClass>(this.apiUrl, payload);
  }

  updateTaxClass(payload: TaxClassUpdatePayload): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${payload.id}`, payload);
  }

  deleteTaxClass(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


  


