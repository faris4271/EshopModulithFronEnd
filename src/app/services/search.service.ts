import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import {
  SearchResultDto,
  SearchPagesResponse,
  SearchPagesParams,
} from '../models/search.model';

export interface SmartTableResult<T> {
  data: T[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/search/pages';

  searchPages(params: SearchPagesParams): Observable<SmartTableResult<SearchResultDto>> {
    return this.http.post<SearchPagesResponse>(this.apiUrl, null, { params: this.toHttpParams(params) }).pipe(
      map((response) => ({
        data: response.items,
        total: response.totalCount,
      }))
    );
  }

  private toHttpParams(params: SearchPagesParams): Record<string, string | number | boolean> {
    const httpParams: Record<string, string | number | boolean> = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    };
    if (params.searchTerm) httpParams['searchTerm'] = params.searchTerm;
    if (params.pageType) httpParams['pageType'] = params.pageType;
    if (params.sortBy) httpParams['sortBy'] = params.sortBy;
    return httpParams;
  }
}