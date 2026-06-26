import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';
import { Brand } from '../../../../../models/brand.model';
import { Category } from '../../../../../models/category.model';
import { TaxClass } from '../../../../../models/tax-class.model';

@Component({
  selector: 'app-product-general-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'./product-general-tab.component.html',
})
export class ProductGeneralTabComponent {
  formService = inject(ProductFormService);

  brands = input<Brand[]>([]);
  categories = input<Category[]>([]);
  taxClasses = input<TaxClass[]>([]);

  isCategoryDropdownOpen = signal(false);

  toggleCategoryDropdown(): void {
    this.isCategoryDropdownOpen.update(v => !v);
  }

  isCategorySelected(id: string): boolean 
  {
    
    return this.formService.isCategorySelected(id);
  }

  toggleCategory(id: string): void {
    this.formService.toggleCategory(id);
  }
}

