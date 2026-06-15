import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';

@Component({
  selector: 'app-product-seo-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-seo-tab.component.html',
})
export class ProductSeoTabComponent {
  formService = inject(ProductFormService);
}

