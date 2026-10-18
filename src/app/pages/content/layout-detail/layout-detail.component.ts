import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';
import { LayoutDto } from '../../../models/layout.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout-detail.component.html',
  styleUrl: './layout-detail.component.css',
})
export class LayoutDetailComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  layout = signal<LayoutDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLayout(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLayout(id: string): void {
    this.loading.set(true);
    this.layoutService.getLayoutById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (layout) => {
        this.layout.set(layout);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load layout:', err);
        this.error.set('Failed to load layout');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/content/layouts']);
  }

  editLayout(): void {
    const layout = this.layout();
    if (layout) {
      this.router.navigate(['/content/layouts/edit', layout.id]);
    }
  }
}