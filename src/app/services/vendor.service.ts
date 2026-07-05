import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VendorItem, VendorDto, VendorListResponse } from '../models/vendor.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/vendors';

  getVendors(params?: SmartTableParam): Observable<SmartTableResult<VendorItem>> {
    return this.http.post<VendorListResponse>(this.apiUrl + '/grid', params || {}).pipe(
      map(response => ({
        data: response.items,
        total: response.totalRecord
      }))
    );
  }

  createVendor(dto: VendorDto): Observable<any> {
    return this.http.post(this.apiUrl, { vendorDto: dto });
  }

  getVendorById(id: string): Observable<VendorItem> {
    return this.http.get<VendorItem>(`${this.apiUrl}/${id}`);
  }

  updateVendor(dto: VendorDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${dto.id}`, dto);
  }

  deleteVendor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
