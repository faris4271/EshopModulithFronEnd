import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import {
  PageDto,
  PageListItem,
  CreatePageDto,
  UpdatePageDto,
} from '../models/page.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';

@Injectable({ providedIn: 'root' })
export class PageService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/pages';

  getPages(params?: SmartTableParam): Observable<SmartTableResult<PageListItem>> {
    return this.http
      .post<{ items: PageListItem[]; totalCount: number }>(`${this.apiUrl}/grid`, params)
      .pipe(
        map((response) => ({
          data: response.items,
          total: response.totalCount,
        }))
      );
  }

  getPageById(id: string): Observable<PageDto> {
    return this.http.get<PageDto>(`${this.apiUrl}/${id}`);
  }

  getPageBySlug(slug: string): Observable<PageDto> {
    return this.http.get<PageDto>(`${this.apiUrl}/slug/${slug}`);
  }

  createPage(dto: CreatePageDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  updatePage(id: string, dto: UpdatePageDto): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, dto);
  }

  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publishPage(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/publish`, {});
  }

  unpublishPage(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/unpublish`, {});
  }
}