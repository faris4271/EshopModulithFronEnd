import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { ProductFormService } from '../../services/product-form.service';
import { ProductSelectorComponent } from './product-selector.component';
import { ProductItem } from '../../../../../models/product.model';
import { ProductService } from '../../../../../services/product.service';


@Component({
  selector: 'app-product-carousel-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductSelectorComponent],
  templateUrl: './product-carousel-tab.component.html',
})
export class ProductCarouselTabComponent {
  formService = inject(ProductFormService);
  private productService = inject(ProductService);

  isModalOpen = signal(false);
  modalType = signal<'related' | 'cross-sell' | null>(null);

  allExcludedIds = computed(() => {
    const relatedIds = this.formService.relatedProducts.controls.map(c => c.get('id')?.value);
    const crossSellIds = this.formService.crossSellProducts.controls.map(c => c.get('id')?.value);
    return [...relatedIds, ...crossSellIds].filter((id): id is string => !!id);
  });

  toFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  removeRelatedRow(index: number) {
    this.formService.removeRelatedProduct(index);
  }

  removeCrossSellRow(index: number) {
    this.formService.removeCrossSellProduct(index);
  }

  openProductSelector(type: 'related' | 'cross-sell') {
    this.modalType.set(type);
    this.isModalOpen.set(true);
  }

  onProductSelected(product: ProductItem) {
    const type = this.modalType();
    if (type === 'related') {
      this.formService.addProductToRelated(product);
    } else if (type === 'cross-sell') {
      this.formService.addProductToCrossSell(product);
    }
    this.closeModal();
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.modalType.set(null);
  }
}


