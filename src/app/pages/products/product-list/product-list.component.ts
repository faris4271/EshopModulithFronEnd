import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import {
  ProductItem,
} from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  productService = inject(ProductService);

  Math = Math;

  allProducts = signal<ProductItem[]>([]);
  searchTerm = signal('');
  filterPublished = signal<boolean | null>(null);
  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(10);
  selectedIds = signal<Set<string>>(new Set());

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(result => {
      this.allProducts.set(result.data);
    });
  }

  filteredProducts = computed(() => {
    let result = this.allProducts();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(search),
      );
    }
    const published = this.filterPublished();
    if (published !== null) {
      result = result.filter((p) => p.isPublished === published);
    }

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      result = [...result].sort((a: any, b: any) => {
        if (typeof a[col] === 'string') return a[col].localeCompare(b[col]) * dir;
        return (a[col] - b[col]) * dir;
      });
    }
    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize()));
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  allSelected = computed(() => {
    const ids = this.selectedIds();
    const products = this.paginatedProducts();
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
    const ids = this.selectedIds();
    const pageProducts = this.paginatedProducts();
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(pageProducts.map((p) => p.id)));
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id as any).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
