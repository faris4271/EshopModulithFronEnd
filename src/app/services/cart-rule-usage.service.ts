import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartRuleUsageDto } from '../models/cart-rule-usage.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CartRuleUsageService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/basket/cart-rules-usage';

  getCartRuleUsages(params?: SmartTableParam): Observable<SmartTableResult<CartRuleUsageDto>> {
    return this.http.post<{ items: CartRuleUsageDto[]; totalRecord: number }>(this.apiUrl + '/grid', params || {}).pipe(
      map(response => ({
        data: response.items,
        total: response.totalRecord
      }))
    );
  }
}