import { Component, EventEmitter, Output, signal, computed, inject, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../services/product.service';
import { ProductItem, ProductStatus, ProductStock } from '../../../../../models/product.model';
import { ProductFormService } from '../../services/product-form.service';

@Component({
  selector: 'app-product-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-selector.component.html',
  styles: []
})
export class ProductSelectorComponent {
  private productService = inject(ProductService);
  private formService = inject(ProductFormService);

  ProductStatus = ProductStatus;
  ProductStock = ProductStock;

  isOpen = input<boolean>(false);
  excludedIds = input<string[]>([]);
  type = input<'related' | 'cross-sell'>('related');

  @Output() closeModal = new EventEmitter<void>();

  searchQuery = signal('');
  allProducts = signal<ProductItem[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.loadProducts();
      }
    }, { allowSignalWrites: true });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService.getProducts().subscribe({
      next: (result) => {
        this.allProducts.set(result.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load products. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading products:', err);
      }
    });
  }

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const excluded = this.excludedIds();
    return this.allProducts().filter(p => 
      p.name.toLowerCase().includes(query) &&
      !excluded.includes(p.id)
    );
  });

  updateSearchQuery(value: string) {
    this.searchQuery.set(value);
  }

  toggleProductSelection(product: ProductItem) {
    if (this.type() === 'related') {
      if (this.isSelectedRelated(product)) {
        this.formService.removeRelatedProductById(product.id);
      } else {
        this.formService.addProductToRelated(product);
      }
    } else {
      if (this.isSelectedCrossSell(product)) {
        this.formService.removeCrossSellProduct(this.formService.crossSellProducts.value.findIndex((p: any) => p.id === product.id));
      } else {
        this.formService.addProductToCrossSell(product);
      }
    }
  }

  isSelectedRelated(product: ProductItem): boolean {
    return this.formService.relatedProducts.value.some(
      (p: any) => p.id === product.id
    );
  }

  isSelectedCrossSell(product: ProductItem): boolean {
    return this.formService.crossSellProducts.value.some(
      (p: any) => p.id === product.id
    );
  }

  isSelected(product: ProductItem): boolean {
    return this.type() === 'related' ? this.isSelectedRelated(product) : this.isSelectedCrossSell(product);
  }

  close() {
    this.closeModal.emit();
  }
}
