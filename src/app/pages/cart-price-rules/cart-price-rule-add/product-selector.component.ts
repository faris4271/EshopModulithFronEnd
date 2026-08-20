import { Component, EventEmitter, Output, signal, computed, inject, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ProductItem } from '../../../models/product.model';

@Component({
  selector: 'app-product-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-selector.component.html',
  styles: []
})
export class ProductSelectorComponent {
  private productService = inject(ProductService);

  isOpen = input<boolean>(false);
  selectedIds = input<string[]>([]);

  @Output() toggle = new EventEmitter<ProductItem>();
  @Output() close = new EventEmitter<void>();

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
    return this.allProducts().filter(p => 
      p.name.toLowerCase().includes(query)
    );
  });

  updateSearchQuery(value: string) {
    this.searchQuery.set(value);
  }

  toggleProductSelection(product: ProductItem) {
    this.toggle.emit(product);
  }

  isSelected(product: ProductItem): boolean {
    return this.selectedIds().includes(product.id);
  }

  onClose() {
    this.close.emit();
  }
}
