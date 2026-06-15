import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { ProductAttribute } from '../../../models/product-attribute.model';

@Component({
  selector: 'app-product-attribute-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-attribute-list.component.html',
  styleUrl: './product-attribute-list.component.css',
})
export class ProductAttributeListComponent {
  private attributeService = inject(ProductAttributeService);
  private router = inject(Router);

  Math = Math;

  allAttributes = signal(this.attributeService.getAttributes());
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);

  filteredAttributes = computed(() => {
    let result = this.allAttributes();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(
        (a) => a.name.toLowerCase().includes(search) || a.groupName.toLowerCase().includes(search),
      );
    }
    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredAttributes().length / this.pageSize()));
  paginatedAttributes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredAttributes().slice(start, start + this.pageSize());
  });

  deleteAttribute(id: string): void {
    if (confirm('Are you sure you want to delete this attribute?')) {
      this.attributeService.deleteAttribute(id);
      this.allAttributes.set(this.attributeService.getAttributes());
    }
  }
}
