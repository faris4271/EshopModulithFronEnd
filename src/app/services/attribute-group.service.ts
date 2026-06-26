import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttributeGroup, AttributeGroupCreatePayload, AttributeGroupUpdatePayload } from '../models/attribute-group.model';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AttributeGroupService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.ApiUrl}/attribute-group`;

  getGroups(): Observable<AttributeGroup[]> {
    return this.http.get<AttributeGroup[]>(this.apiUrl);
  }

  getGroupById(id: string ): Observable<AttributeGroup> {
    return this.http.get<AttributeGroup>(`${this.apiUrl}/${id}`);
  }

  addGroup(group: AttributeGroupCreatePayload): Observable<AttributeGroup> {
    return this.http.post<AttributeGroup>(this.apiUrl, group);
  }

  updateGroup(group: AttributeGroupUpdatePayload): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${group.id}`, group);
  }

  deleteGroup(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
