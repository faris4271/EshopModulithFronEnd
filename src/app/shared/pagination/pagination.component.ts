import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="text-sm text-gray-500">
        Showing {{ startItem() }} to {{ endItem() }} of {{ totalItems() }} entries
      </div>
      <div class="flex items-center gap-1">
        <button
          (click)="previousPage()"
          [disabled]="currentPage() === 1"
          class="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        @for (page of visiblePages(); track $index) {
          <button
            (click)="goToPage(page)"
            [class.bg-indigo-600 text-white]="page === currentPage()"
            class="w-8 h-8 rounded-md border border-gray-300 text-sm transition-colors hover:bg-gray-100"
          >
            {{ page }}
          </button>
        }
        <button
          (click)="nextPage()"
          [disabled]="currentPage() >= totalPages()"
          class="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  // Inputs
  totalItems = input.required<number>();
  itemsPerPage = input(10);
  currentPage = input(1);
  maxVisiblePages = input(5);

  // Outputs
  pageChange = output<number>();

  // Computed
  totalPages = computed(() => {
    const size = Math.max(1, this.itemsPerPage());
    const raw = Math.ceil(this.totalItems() / size);
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  });
  visiblePages = computed(() => {
    const total = this.totalPages();
    const maxVisible = Math.max(1, this.maxVisiblePages());
    const current = Math.max(1, Math.min(this.currentPage(), total));

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // Helpers
  startItem = computed(() => {
    const total = this.totalItems();
    if (!Number.isFinite(total) || total <= 0) return 0;
    const size = Math.max(1, this.itemsPerPage());
    const current = Math.max(1, this.currentPage());
    return (current - 1) * size + 1;
  });
  endItem = computed(() => {
    const total = this.totalItems();
    if (!Number.isFinite(total) || total <= 0) return 0;
    const size = Math.max(1, this.itemsPerPage());
    const current = Math.max(1, this.currentPage());
    return Math.min(current * size, total);
  });

  // Methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}