import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { PageDto } from '../../../models/page.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-page-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-detail.component.html',
  styleUrl: './page-detail.component.css',
})
export class PageDetailComponent implements OnInit, OnDestroy {
  private pageService = inject(PageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  page = signal<PageDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPage(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPage(id: string): void {
    this.loading.set(true);
    this.pageService.getPageById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (page) => {
        this.page.set(page);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load page:', err);
        this.error.set('Failed to load page');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/content/pages']);
  }

  editPage(): void {
    const page = this.page();
    if (page) {
      this.router.navigate(['/content/pages/edit', page.id]);
    }
  }
}