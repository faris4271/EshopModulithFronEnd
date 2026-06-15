import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand, CreateBrandDto, UpdateBrandDto } from '../models/brand.model';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + "/brands";

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }

  getBrandById(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/${id}`);
  }

  createBrand(dto: CreateBrandDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  updateBrand(dto: UpdateBrandDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${dto.id}`, dto);
  }

  deleteBrand(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
