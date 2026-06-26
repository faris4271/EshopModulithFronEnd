import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateProductDto,
  ProductItem,
  ProductListResponse,
} from '../models/product.model';
import { SmartTableParam, SmartTableResult } from '../models/SmartTableParam';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl + '/products';

  createProduct(
    dto: CreateProductDto,
    thumbnailImage?: File,
    ProductImages?: File[],
    productDocuments?: File[],
  ): Observable<any> {
    const formData = new FormData();
    const cleanedDto = structuredClone(dto);

    // Clean top-level images from DTO
    delete cleanedDto.thumbnailImage;
    delete cleanedDto.productImages;
    delete cleanedDto.productDocuments;

    // Clean variations and append files
    if (cleanedDto.variations) {
      cleanedDto.variations.forEach((v, index) => {
        if (v.thumbnailImage) {
          formData.append(`Variations[${index}].ThumbnailImage`, v.thumbnailImage, v.thumbnailImage.name);
        }
        delete v.thumbnailImage;

        if (v.newImages) {
          v.newImages.forEach((file) => {
            formData.append(`Variations[${index}].NewImages`, file, file.name);
          });
        }
        delete v.newImages;
      });
    }

    formData.append('Product', JSON.stringify(cleanedDto));

    if (thumbnailImage) {
      formData.append('ThumbnailImage', thumbnailImage, thumbnailImage.name);
    }
    if (ProductImages) {
      ProductImages.forEach((file) => formData.append('ProductImages', file, file.name));
    }
    if (productDocuments) {
      productDocuments.forEach((file) => formData.append('ProductDocuments', file, file.name));
    }
    
    return this.http.post(this.apiUrl, formData);
  }

  // Retrieve a single product by ID using correct /products endpoint
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update an existing product; mirrors createProduct FormData structure but uses PUT
  updateProduct(
    id: string,
    dto: CreateProductDto,
    thumbnailImage?: File,
    ProductImages?: File[],
    productDocuments?: File[],
  ): Observable<any> {
    const formData = new FormData();
    const cleanedDto = structuredClone(dto);

    // Clean top-level images from DTO
    delete cleanedDto.thumbnailImage;
    delete cleanedDto.productImages;
    delete cleanedDto.productDocuments;

    // Clean variations and append files (same as create)
    if (cleanedDto.variations) {
      cleanedDto.variations.forEach((v, index) => {
        if (v.thumbnailImage) {
          formData.append(`Variations[${index}].ThumbnailImage`, v.thumbnailImage, v.thumbnailImage.name);
        }
        delete v.thumbnailImage;

        if (v.newImages) {
          v.newImages.forEach((file) => {
            formData.append(`Variations[${index}].NewImages`, file, file.name);
          });
        }
        delete v.newImages;
      });
    }

    formData.append('Product', JSON.stringify(cleanedDto));

    if (thumbnailImage) {
      formData.append('ThumbnailImage', thumbnailImage, thumbnailImage.name);
    }
    if (ProductImages) {
      ProductImages.forEach((file) => formData.append('ProductImages', file, file.name));
    }
    if (productDocuments) {
      productDocuments.forEach((file) => formData.append('ProductDocuments', file, file.name));
    }

    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }
  getProducts(params?: SmartTableParam): Observable<SmartTableResult<ProductItem>> {
    return this.http.post<ProductListResponse>(this.apiUrl+"/grid", params || {}).pipe(
      map(response => ({
        data: response.items,
        total: response.totalRecord
      }))
    );
  }

 


  
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Toggle published status of a product.
   * Sends PUT request to `/products/{id}/toggle-status`.
   */
  toggleProductStatus(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  


}
