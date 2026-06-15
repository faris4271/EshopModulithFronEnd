import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';

@Component({
  selector: 'app-product-inventory-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-inventory-tab.component.html',
})
export class ProductInventoryTabComponent {
  formService = inject(ProductFormService);
}

