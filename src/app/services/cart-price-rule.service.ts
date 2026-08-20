import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CartPriceRuleItem,
  CartPriceRuleListResponse,
  CartRuleDto,
} from '../models/cart-price-rule.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CartPriceRuleService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/basket/cart-rules';

  getCartPriceRules(params?: SmartTableParam): Observable<SmartTableResult<CartPriceRuleItem>> {
    return this.http.post<CartPriceRuleListResponse>(this.apiUrl + '/grid', params || {}).pipe(
      map(response => ({
        data: response.items,
        total: response.totalRecord
      }))
    );
  }

  deleteCartPriceRule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleCartPriceRuleStatus(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  createCartPriceRule(dto: CartRuleDto): Observable<any> {
    return this.http.post(this.apiUrl, { cartRuleDto: dto });
  }

  getCartPriceRule(id: string): Observable<CartRuleDto> {
    return this.http.get<CartRuleDto>(`${this.apiUrl}/${id}`);
  }

  updateCartPriceRule(id: string, dto: CartRuleDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { cartRuleDto: dto });
  }
}
