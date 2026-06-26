import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductAttributeTemplateService } from '../../../services/product-attribute-template.service';
import { ProductAttributeTemplate } from '../../../models/product-attribute-template.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product-attribute-template-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmationDialogComponent],
  templateUrl: './product-attribute-template-list.component.html',
  styleUrl: './product-attribute-template-list.component.css',
})
export class ProductAttributeTemplateListComponent implements OnInit {
  private templateService = inject(ProductAttributeTemplateService);
  private router = inject(Router);

  Math = Math;

  allTemplates = signal<ProductAttributeTemplate[]>([]);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  templateToDelete = signal<ProductAttributeTemplate | null>(null);

  filteredTemplates = computed(() => {
    let result = this.allTemplates();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(
        (t) => t.name.toLowerCase().includes(search) || t.groupName.toLowerCase().includes(search),
      );
    }
    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredTemplates().length / this.pageSize()));
  paginatedTemplates = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredTemplates().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templateService.getAttributeTemplates().subscribe((templates) => {
      this.allTemplates.set(templates);
    });
  }

  deleteTemplate(template: ProductAttributeTemplate): void {
    this.templateToDelete.set(template);
  }

  cancelDelete(): void {
    this.templateToDelete.set(null);
  }

  confirmDelete(): void {
    const template = this.templateToDelete();
    if (template) {
      this.templateService.deleteAttributeTemplate(template.id).subscribe(() => {
        this.loadTemplates();
        this.cancelDelete();
      });
    }
  }

  get deletionMessage(): string {
    const template = this.templateToDelete();
    return template 
      ? `Are you sure you want to delete "${template.name}"? This action cannot be undone.` 
      : 'Are you sure you want to delete this attribute template? This action cannot be undone.';
  }
}
