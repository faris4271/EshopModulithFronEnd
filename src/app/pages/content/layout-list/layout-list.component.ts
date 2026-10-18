import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LayoutService } from '../../../services/layout.service';
import { LayoutListItem, CreateLayoutDto, UpdateLayoutDto } from '../../../models/layout.model';
import { SmartTableParam } from '../../../models/SmartTableParam';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-layout-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent, ConfirmationDialogComponent],
  templateUrl: './layout-list.component.html',
  styleUrl: './layout-list.component.css',
})
export class LayoutListComponent {
  layoutService = inject(LayoutService);

  allLayouts = signal<LayoutListItem[]>([]);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  layoutToDelete = signal<LayoutListItem | null>(null);
  sortColumn = signal('UpdatedAt');
  sortDirection = signal<'asc' | 'desc'>('desc');

  private searchTerm$ = new Subject<string>();

  constructor() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadLayouts();
    });

    this.loadLayouts();
  }

  loadLayouts() {
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

    this.layoutService.getLayouts(params).subscribe({
      next: (result) => {
        this.allLayouts.set(result.data);
        this.totalRecords.set(result.total);
      },
      error: (err) => console.error('Failed to load layouts:', err),
    });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.searchTerm$.next(value);
  }

  onSearchChange() {
    this.updateSearchTerm(this.searchTerm());
  }

  onSortChange(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.loadLayouts();
  }

  deleteLayout(layout: LayoutListItem): void {
    this.layoutToDelete.set(layout);
  }

  confirmDelete(): void {
    const layout = this.layoutToDelete();
    if (layout) {
      this.layoutService.deleteLayout(layout.id).subscribe(() => {
        this.loadLayouts();
        this.cancelDelete();
      });
    }
  }

  cancelDelete(): void {
    this.layoutToDelete.set(null);
  }
}