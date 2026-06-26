import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { ProductAttribute } from '../../../models/product-attribute.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product-attribute-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmationDialogComponent],
  templateUrl: './product-attribute-list.component.html',
  styleUrl: './product-attribute-list.component.css',
})
export class ProductAttributeListComponent implements OnInit {
  private attributeService = inject(ProductAttributeService);
  private router = inject(Router);

  Math = Math;

  allAttributes = signal<ProductAttribute[]>([]);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  attributeToDelete = signal<ProductAttribute | null>(null);

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

  ngOnInit(): void {
    this.loadAttributes();
  }

  loadAttributes(): void {
    this.attributeService.getAttributes().subscribe((attributes) => {
      this.allAttributes.set(attributes);
    });
  }

  deleteAttribute(attribute: ProductAttribute): void {
    this.attributeToDelete.set(attribute);
  }

  cancelDelete(): void {
    this.attributeToDelete.set(null);
  }

  confirmDelete(): void {
    const attribute = this.attributeToDelete();
    if (attribute) {
      this.attributeService.deleteAttribute(attribute.id).subscribe(() => {
        this.loadAttributes();
        this.cancelDelete();
      });
    }
  }

  get deletionMessage(): string {
    const attribute = this.attributeToDelete();
    return attribute 
      ? `Are you sure you want to delete "${attribute.name}"? This action cannot be undone.` 
      : 'Are you sure you want to delete this attribute? This action cannot be undone.';
  }
}
