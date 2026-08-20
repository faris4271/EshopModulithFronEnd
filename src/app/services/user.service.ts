import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserGridItem, UserListResponse } from '../models/user.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/users';

  getUsers(params?: SmartTableParam): Observable<SmartTableResult<UserGridItem>> {
    return this.http.post<UserListResponse>(this.apiUrl + '/grid', params || {}).pipe(
      map(response => ({
        data: response.items,
        total: response.totalRecord
      }))
    );
  }
}
