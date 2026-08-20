import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UserGridItem } from '../../../models/user.model';
import { SmartTableParam } from '../../../models/SmartTableParam';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  userService = inject(UserService);

  Math = Math;

  allUsers = signal<UserGridItem[]>([]);
  searchTerm = signal('');
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  sortColumn = signal('FirstName');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  selectedIds = signal<Set<string>>(new Set());
  
  private searchTerm$ = new Subject<string>();

  constructor() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadUsers();
    });

    this.loadUsers();
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.searchTerm$.next(value);
  }

  loadUsers() {
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
          FullName: this.searchTerm() || undefined,
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

    this.userService.getUsers(params).subscribe(result => {
      this.allUsers.set(result.data);
      this.totalRecords.set(result.total);
    });
  }

  allSelected = computed(() => {
    const ids = this.selectedIds();
    const users = this.allUsers();
    return users.length > 0 && users.every((u) => ids.has(u.id));
  });

  toggleSelect(id: string): void {
    this.selectedIds.update((ids) => {
      const newSet = new Set(ids);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  toggleAllSelect(): void {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      const allIds = this.allUsers().map(u => u.id);
      this.selectedIds.set(new Set(allIds));
    }
  }
}
