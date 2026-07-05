import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StockItem, AdjustStockDto, StockHistoryEntry } from '../models/stock.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/inventory/stocks';

  getStocks(warehouseId:string,body?: SmartTableParam): Observable<SmartTableResult<StockItem>> {
    return this.http.post<any>(`${this.apiUrl}/grid/${warehouseId}`,body ).pipe(
      map(response => ({
        data: response.items,
        total: response.totalRecord ?? response.total ?? 0,
      })),
      catchError(err => {
        console.error('Error fetching stocks:', err);
        return of({ data: [], total: 0 });
      })
    );
  }



  adjustStockBulk(dtos: AdjustStockDto[]): Observable<any> {

    return this.http.put(`${this.apiUrl}`, dtos).pipe(
      catchError(error => {
        console.error('Adjust stock bulk failed:', error);
        return throwError(() => error);
      })
    );
  }

  getStockHistoryByProduct(productId: string, warehouseId: string): Observable<StockHistoryEntry[]> {
    
    return this.http.get<StockHistoryEntry[]>(`${this.apiUrl}/${productId}/${warehouseId}`, );
  }

  deleteStock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
