import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageService } from '../../../services/page.service';
import {
  PageListItem,
  PAGE_TYPE_OPTIONS,
} from '../../../models/page.model';
import { SmartTableParam } from '../../../models/SmartTableParam';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-page-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent, ConfirmationDialogComponent],
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.css',
})
export class PageListComponent {
  pageService = inject(PageService);

  allPages = signal<PageListItem[]>([]);
  searchTerm = signal('');
  filterPageType = signal<string | null>(null);
  filterPublished = signal<boolean | null>(null);
  sortColumn = signal('UpdatedAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  pageToDelete = signal<PageListItem | null>(null);
  pageToToggle = signal<PageListItem | null>(null);

  private searchTerm$ = new Subject<string>();

  constructor() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadPages();
    });

    this.loadPages();
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.searchTerm$.next(value);
  }

  loadPages() {
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
          PageType: this.filterPageType() ?? undefined,
          IsPublished: this.filterPublished() ?? undefined,
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

    this.pageService.getPages(params).subscribe(result => {
      this.allPages.set(result.data);
      this.totalRecords.set(result.total);
    });
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.loadPages();
  }

  toggleStatus(page: PageListItem): void {
    this.pageToToggle.set(page);
    this.allPages.update(pages =>
      pages.map(p => p.id === page.id ? { ...p, isPublished: !p.isPublished } : p)
    );
    const action = page.isPublished ? this.pageService.unpublishPage(page.id) : this.pageService.publishPage(page.id);
    action.subscribe({
      error: () => this.loadPages()
    });
  }

  deletePage(page: PageListItem): void {
    this.pageToDelete.set(page);
  }

  confirmDelete(): void {
    const page = this.pageToDelete();
    if (page) {
      this.pageService.deletePage(page.id).subscribe(() => {
        this.loadPages();
        this.cancelDelete();
      });
    }
  }

  cancelDelete(): void {
    this.pageToDelete.set(null);
  }

  pageTypeOptions = PAGE_TYPE_OPTIONS;
}