import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';

@Component({
  selector: 'app-product-media-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-media-tab.component.html',
})
export class ProductMediaTabComponent {
  formService = inject(ProductFormService);

  onThumbnailImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formService.onThumbnailImageChange(input.files[0]);
    }
  }

  onProductImagesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.formService.onProductImagesChange(Array.from(input.files));
    }
  }

  onProductDocumentsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.formService.onProductDocumentsChange(Array.from(input.files));
    }
  }
}

