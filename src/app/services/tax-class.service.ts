import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxClass } from '../models/tax-class.model';

@Injectable({ providedIn: 'root' })
export class TaxClassService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:53750/api/tax-classes';

  getTaxClasses(): Observable<TaxClass[]> {
    return this.http.get<TaxClass[]>(this.apiUrl);
  }
}
