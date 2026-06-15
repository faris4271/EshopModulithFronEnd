import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';
import { Brand } from '../../../../../models/brand.model';
import { Category } from '../../../../../models/category.model';
import { TaxClass } from '../../../../../models/tax-class.model';
import { ProductAttribute } from '../../../../../models/product-attribute.model';

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
  availableAttributes = input<ProductAttribute[]>([]);

  isCategoryDropdownOpen = signal(false);

  toggleCategoryDropdown(): void {
    this.isCategoryDropdownOpen.update(v => !v);
  }

  isCategorySelected(id: number): boolean {
    return this.formService.isCategorySelected(id);
  }

  toggleCategory(id: number): void {
    this.formService.toggleCategory(id);
  }

  onAttributeSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = String(select.value);
    this.formService.onAttributeSelect(id);
    select.value = '';
  }
}

