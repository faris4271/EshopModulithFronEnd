import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + "/category";

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(dto: CreateCategoryDto, thumbnailImage?: File): Observable<any> {
    const formData = new FormData();
    
    formData.append(`name`, dto.name);
    formData.append(`slug`, dto.slug);
    formData.append(`description`, dto.description || '');
    formData.append(`metaTitle`, dto.metaTitle || '');
    formData.append(`metaKeywords`, dto.metaKeywords || '');
    formData.append(`metaDescription`, dto.metaDescription || '');
    formData.append(`displayOrder`, String(dto.displayOrder));
    if(dto.parentId) {
      formData.append(`parentId`, dto.parentId || '');
    }
    formData.append(`includeInMenu`, String(dto.includeInMenu));
    formData.append(`isPublished`, String(dto.isPublished));
    formData.append(`thumbnailImageUrl`, dto.thumbnailImageUrl || '');

    if (thumbnailImage) {
      formData.append('ThumbnailImage', thumbnailImage, thumbnailImage.name);
    }

    return this.http.post(this.apiUrl, formData);
  }

  updateCategory(dto: UpdateCategoryDto, thumbnailImage?: File): Observable<any> {
    const formData = new FormData();
   
     formData.append(`id`, String(dto.id));
    formData.append(`name`, dto.name);
    formData.append(`slug`, dto.slug);
    formData.append(`description`, dto.description || '');
    formData.append(`metaTitle`, dto.metaTitle || '');
    formData.append(`metaKeywords`, dto.metaKeywords || '');
    formData.append(`metaDescription`, dto.metaDescription || '');
    formData.append(`displayOrder`, String(dto.displayOrder));
    if(dto.parentId) {
      formData.append(`parentId`, dto.parentId || '');
    }
    formData.append(`includeInMenu`, String(dto.includeInMenu));
    formData.append(`isPublished`, String(dto.isPublished));
    formData.append(`thumbnailImageUrl`, dto.thumbnailImageUrl || '');

    if (thumbnailImage) {
      formData.append('ThumbnailImage', thumbnailImage, thumbnailImage.name);
    }

    return this.http.put(`${this.apiUrl}/${dto.id}`, formData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
