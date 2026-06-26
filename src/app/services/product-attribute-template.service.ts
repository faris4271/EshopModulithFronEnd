import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductAttributeTemplate } from '../models/product-attribute-template.model';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductAttributeTemplateService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/product-templet';

  getAttributeTemplates(): Observable<ProductAttributeTemplate[]> {
    return this.http.get<ProductAttributeTemplate[]>(this.apiUrl);
  }

  getAttributeTemplateById(id: string): Observable<{ id: string; name: string; attributes: { id: string; name: string; groupName: string }[] }> {
    return this.http.get<{ id: string; name: string; attributes: { id: string; name: string; groupName: string }[] }>(`${this.apiUrl}/${id}`);
  }

  addAttributeTemplate(template: { templetDto: { name: string; attributeIds: string[] } }): Observable<ProductAttributeTemplate> {
    return this.http.post<ProductAttributeTemplate>(this.apiUrl, template);
  }

  updateAttributeTemplate(template: { templetDto: { id: string; name: string; attributeIds: string[] } }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${template.templetDto.id}`, template);
  }

  deleteAttributeTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
