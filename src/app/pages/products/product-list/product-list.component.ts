import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import {
  ProductItem,
} from '../../../models/product.model';
import { SmartTableParam } from '../../../models/SmartTableParam';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule, PaginationComponent, ConfirmationDialogComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  productService = inject(ProductService);

  Math = Math;

  allProducts = signal<ProductItem[]>([]);
  searchTerm = signal('');
  filterPublished = signal<boolean | null>(null);
  filterFeatured = signal<boolean | null>(null);
  filterHasOptions = signal<boolean | null>(null);
  filterIsVisibleIndividually = signal<boolean | null>(null);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  sortColumn = signal('Name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  selectedIds = signal<Set<string>>(new Set());
  productToDelete = signal<ProductItem | null>(null);

  private searchTerm$ = new Subject<string>();

  constructor() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadProducts();
    });

    this.loadProducts();
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.searchTerm$.next(value);
  }

  loadProducts() {
    const params: SmartTableParam = {
       pagination: {
         Page: this.currentPage(),
         PageSize: this.pageSize(),
         Start: (this.currentPage() - 1) * this.pageSize(),
       },
      sort: {
        Predicate: this.sortColumn(),
        Reverse: this.sortDirection() === 'desc',
      },
      search: {
        PredicateObject: {
          Name: this.searchTerm() || undefined,
          IsPublished: this.filterPublished() ?? undefined,
          IsFeatured: this.filterFeatured() ?? undefined,
          HasOptions: this.filterHasOptions() ?? undefined,
          IsVisibleIndividually: this.filterIsVisibleIndividually() ?? undefined,
          CreatedOn: (this.dateFrom() || this.dateTo()) ? {
            before: this.dateTo() || undefined,
            after: this.dateFrom() || undefined,
          } : undefined,
        },
      },
    };

    if (params.search?.PredicateObject) {
      Object.keys(params.search.PredicateObject).forEach(key => {
        if (params.search!.PredicateObject![key] === undefined) {
          delete params.search!.PredicateObject![key];
        }
      });
    }

    this.productService.getProducts(params).subscribe(result => {
      this.allProducts.set(result.data);
      this.totalRecords.set(result.total);
    });
  }

  allSelected = computed(() => {
    const ids = this.selectedIds();
    const products = this.allProducts();
    return products.length > 0 && products.every((p) => ids.has(p.id));
  });

  toggleSelect(id: string): void {
    this.selectedIds.update((ids) => {
      const newSet = new Set(ids);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  toggleSelectAll(): void {
    const pageProducts = this.allProducts();
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(pageProducts.map((p) => p.id)));
    }
  }

  deleteProduct(product: ProductItem): void {
    this.productToDelete.set(product);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (product) {
      this.productService.deleteProduct(product.id as any).subscribe(() => {
        this.loadProducts();
        this.cancelDelete();
      });
    }
  }

  cancelDelete(): void {
    this.productToDelete.set(null);
  }

  /**
   * Toggle product published status.
   * Optimistically updates UI, then calls service. On error reloads list.
   */
  toggleStatus(id: string): void {
    // Optimistic UI update
    this.allProducts.update(products =>
      products.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p)
    );
    this.productService.toggleProductStatus(id).subscribe({
      error: () => this.loadProducts()
    });
  }
}