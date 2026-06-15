import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';
import { ProductOption } from '../../../../../models/product-option.model';


@Component({
  selector: 'app-product-variations-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-variations-tab.component.html',
})
export class ProductVariationsTabComponent {
  formService = inject(ProductFormService);
  private fb = inject(FormBuilder);

  availableOptions = input<ProductOption[]>([]);

  headerOptions = computed(() => {
    return this.formService.options.controls
      .map((control) => {
        const name = control.get('name')?.value;
        const values = this.formService.getOptionValuesForm(this.formService.options.controls.indexOf(control)).controls
          .map((v) => v.get('name')?.value)
          .filter((v) => v);
        return { name, values };
      })
      .filter((opt) => opt.values.length === 0);
  });

  onOptionSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    this.formService.onOptionSelect(id, this.availableOptions());
    select.value = '';
  }

  addOptionValueFromInput(optionIndex: number, value: string): void {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    const valuesArray = this.formService.getOptionValuesForm(optionIndex);
    const existingValues = valuesArray.controls.map((c) => c.get('name')?.value);
    if (existingValues.includes(trimmedValue)) {
      return;
    }

    this.formService.addOptionValue(optionIndex, trimmedValue);
  }

  onVariationThumbnailChange(variationIndex: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formService.onVariationThumbnailChange(variationIndex, input.files[0]);
    }
  }

  onVariationImagesChange(variationIndex: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.formService.onVariationImagesChange(variationIndex, Array.from(input.files));
    }
  }
}

