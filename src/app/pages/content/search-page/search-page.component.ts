import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchService } from '../../../services/search.service';
import { SearchResultDto, SearchPagesParams, SEARCH_SORT_OPTIONS } from '../../../models/search.model';
import { PAGE_TYPE_OPTIONS } from '../../../models/page.model';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export class SearchPageComponent {
  searchService = inject(SearchService);

  results = signal<SearchResultDto[]>([]);
  searchTerm = signal('');
  filterPageType = signal<string | null>(null);
  sortBy = signal<'relevance' | 'name' | 'date'>('relevance');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  loading = signal(false);

  private searchTerm$ = new Subject<string>();

  constructor() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.search();
    });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.searchTerm$.next(value);
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.search();
  }

  search() {
    const term = this.searchTerm().trim();
    if (!term) {
      this.results.set([]);
      this.totalRecords.set(0);
      return;
    }

    this.loading.set(true);
    const params: SearchPagesParams = {
      searchTerm: term,
      pageNumber: this.currentPage(),
      pageSize: this.pageSize(),
      pageType: this.filterPageType() || undefined,
      sortBy: this.sortBy(),
    };

    this.searchService.searchPages(params).subscribe({
      next: (result) => {
        this.results.set(result.data);
        this.totalRecords.set(result.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.loading.set(false);
      },
    });
  }

  pageTypeOptions = PAGE_TYPE_OPTIONS;
  sortOptions = SEARCH_SORT_OPTIONS;
}