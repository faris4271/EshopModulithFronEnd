import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';

@Component({
  selector: 'app-product-pricing-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-pricing-tab.component.html',
})
export class ProductPricingTabComponent {
  formService = inject(ProductFormService);
}

