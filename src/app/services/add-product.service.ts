import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProductDto } from '../models/product.model';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AddProductService {
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
}
