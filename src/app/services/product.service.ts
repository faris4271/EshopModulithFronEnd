import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateProductDto,
  Product,
  ProductCategory,
  ProductStock,
  ProductStatus,
  ProductItem,
  ProductListResponse,
} from '../models/product.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl;

  getProducts(params?: SmartTableParam): Observable<SmartTableResult<ProductItem>> {
    return this.http.post<ProductListResponse>(this.apiUrl+"/product-grid", params || {}).pipe(
      map(response => ({
        data: response.items,
        total: response.totalRecord
      }))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createProduct(
    dto: CreateProductDto,
    thumbnailImage?: File,
    productImages?: File[],
    productDocuments?: File[],
  ): Observable<any> {
    const formData = new FormData();
    formData.append('Product', JSON.stringify(dto));

    if (thumbnailImage) {
      formData.append('ThumbnailImage', thumbnailImage, thumbnailImage.name);
    }

    if (productImages) {
      productImages.forEach((file) => {
        formData.append('ProductImages', file, file.name);
      });
    }

    if (productDocuments) {
      productDocuments.forEach((file) => {
        formData.append('ProductDocuments', file, file.name);
      });
    }

    return this.http.post(this.apiUrl, formData);
  }

  getCategoryName(categoryId: number): string {
    const names: Record<number, string> = {
      [ProductCategory.Household]: 'Household',
      [ProductCategory.Office]: 'Office',
      [ProductCategory.Electronics]: 'Electronics',
      [ProductCategory.Shoes]: 'Shoes',
      [ProductCategory.Accessories]: 'Accessories',
      [ProductCategory.Game]: 'Game',
    };
    return names[categoryId] || 'Unknown';
  }

  getCategoryIcon(categoryId: number): string {
    const icons: Record<number, string> = {
      [ProductCategory.Household]: 'bx-briefcase',
      [ProductCategory.Office]: 'bx-home-smile',
      [ProductCategory.Electronics]: 'bx-headphone',
      [ProductCategory.Shoes]: 'bx-walk',
      [ProductCategory.Accessories]: 'bxs-watch',
      [ProductCategory.Game]: 'bx-laptop',
    };
    return icons[categoryId] || 'bx-box';
  }

  getCategoryColor(categoryId: number): string {
    const colors: Record<number, string> = {
      [ProductCategory.Household]: 'warning',
      [ProductCategory.Office]: 'info',
      [ProductCategory.Electronics]: 'danger',
      [ProductCategory.Shoes]: 'success',
      [ProductCategory.Accessories]: 'secondary',
      [ProductCategory.Game]: 'primary',
    };
    return colors[categoryId] || 'primary';
  }

  getStatusName(statusId: number): string {
    const names: Record<number, string> = {
      [ProductStatus.Scheduled]: 'Scheduled',
      [ProductStatus.Publish]: 'Published',
      [ProductStatus.Inactive]: 'Inactive',
    };
    return names[statusId] || 'Unknown';
  }

  getStatusColor(statusId: number): string {
    const colors: Record<number, string> = {
      [ProductStatus.Scheduled]: 'warning',
      [ProductStatus.Publish]: 'success',
      [ProductStatus.Inactive]: 'danger',
    };
    return colors[statusId] || 'secondary';
  }
}
