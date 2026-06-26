import { Component, inject, input, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';
import { ProductAttribute } from '../../../../../models/product-attribute.model';
import { ProductAttributeTemplateService } from '../../../../../services/product-attribute-template.service';
import { ProductAttributeTemplate } from '../../../../../models/product-attribute-template.model';

@Component({
  selector: 'app-product-attributes-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-attributes-tab.component.html',
})
export class ProductAttributesTabComponent {
  formService = inject(ProductFormService);
  private templateService = inject(ProductAttributeTemplateService);
  private cdr = inject(ChangeDetectorRef);

  availableAttributes = input<ProductAttribute[]>([]);
  templates = signal<ProductAttributeTemplate[]>([]);

  constructor() {
    this.loadTemplates();
    this.formService.attributes.valueChanges.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  loadTemplates(): void {
    this.templateService.getAttributeTemplates().subscribe({
      next: (data) => this.templates.set(data),
      error: (err) => console.error('Failed to load attribute templates:', err),
    });
  }

  onAttributeSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = String(select.value);
    this.formService.onAttributeSelect(id);
    select.value = '';
    this.cdr.markForCheck();
  }

  onTemplateSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = String(select.value);
    if (!id) return;

    this.templateService.getAttributeTemplateById(id).subscribe({
      next: (template) => {
        this.formService.applyTemplate(template.attributes);
        select.value = '';
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load template details:', err),
    });
  }
}
