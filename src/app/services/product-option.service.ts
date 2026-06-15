import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductOption, OptionStatus, CreateProductOptionDto, UpdateProductOptionDto } from '../models/product-option.model';
import { OPTION_STATUS_CONFIG } from '../models/product-option.constants';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductOptionService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + "/product-options";

  getOptions(): Observable<ProductOption[]> {
    return this.http.get<ProductOption[]>(this.apiUrl);
  }

  getOptionById(id: string): Observable<ProductOption> {
      console.log()
    return this.http.get<ProductOption>(`${this.apiUrl}/${id}`);
    
  }

  createOption(option: CreateProductOptionDto): Observable<ProductOption> {
    return this.http.post<ProductOption>(this.apiUrl, {
      productOption: {
        name: option.name
      }
    });
  }

  updateOption(option: UpdateProductOptionDto): Observable<ProductOption> {
      console.log(option)
    return this.http.put<ProductOption>(`${this.apiUrl}/${option.id}`, option);
  }

  deleteOption(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStatusName(status: OptionStatus): string {
    return OPTION_STATUS_CONFIG[status]?.label || 'Unknown';
  }

  getStatusColor(status: OptionStatus): string {
    return OPTION_STATUS_CONFIG[status]?.colorClass || '';
  }
}
