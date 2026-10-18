import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import {
  LayoutDto,
  LayoutListItem,
  CreateLayoutDto,
  UpdateLayoutDto,
} from '../models/layout.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/layouts';

  getAllLayouts(): Observable<LayoutListItem[]> {
    return this.http.get<LayoutDto[]>(this.apiUrl).pipe(
      map((layouts) => layouts as LayoutListItem[])
    );
  }

  getLayouts(params?: SmartTableParam): Observable<SmartTableResult<LayoutListItem>> {
    return this.http
      .post<{ items: LayoutListItem[]; totalCount: number }>(`${this.apiUrl}/grid`, params)
      .pipe(map((response) => ({ data: response.items, total: response.totalCount })));
  }

  getLayoutById(id: string): Observable<LayoutDto> {
    return this.http.get<LayoutDto>(`${this.apiUrl}/${id}`);
  }

  createLayout(dto: CreateLayoutDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  updateLayout(id: string, dto: UpdateLayoutDto): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, dto);
  }

  deleteLayout(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}