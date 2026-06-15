import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: () => this.categories.set([]),
    });
  }

  getBgClass(color: string): string {
    const map: Record<string, string> = {
      warning: 'bg-amber-50',
      info: 'bg-blue-50',
      danger: 'bg-red-50',
      success: 'bg-green-50',
      secondary: 'bg-gray-100',
      primary: 'bg-indigo-50',
    };
    return map[color] || 'bg-gray-50';
  }

  getTextClass(color: string): string {
    const map: Record<string, string> = {
      warning: 'text-amber-600',
      info: 'text-blue-600',
      danger: 'text-red-600',
      success: 'text-green-600',
      secondary: 'text-gray-600',
      primary: 'text-indigo-600',
    };
    return map[color] || 'text-gray-600';
  }
}
