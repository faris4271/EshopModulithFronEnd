import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category, UpdateCategoryDto } from '../../../models/category.model';
import ca from '@angular/common/locales/extra/ca';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent implements OnInit {

  
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  categoryNotFound = signal(false);
  thumbnailFile: File | null = null;
  thumbnailPreview = signal<string | null>(null);
   parentCategories = signal<Category[]>([]);

  private categoryId = (this.route.snapshot.paramMap.get('id') || "");
  private existingCategory: Category | null = null;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required]],
    description: [''],
    metaTitle: [''],
    metaKeywords: [''],
    metaDescription: [''],
    displayOrder: [0, [Validators.min(0)]],
    parentId: [''],
    includeInMenu: [true],
    isPublished: [true],
    thumbnailImageUrl: [''],
  });

  ngOnInit(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.existingCategory = category;
        this.form.patchValue({
          name: category.name ||"",
          slug: category.name,
          metaTitle:category.metaTitle,
          metaKeywords:category.metaKeywords,
          metaDescription:category.metaDescription,
          displayOrder:category.displayOrder,
          description: category.description,
          isPublished: category.status === 1,
        });
      },
      error: () => {
        console.log(this.categoryId)
        this.categoryNotFound.set(true);
      },
    });

    this.categoryService.getCategories().subscribe({
      next: (data) => this.parentCategories.set(data),
      error: () => this.parentCategories.set([]),
    });
  }

  generateSlug(): void {
    const name = this.form.get('name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      this.form.get('slug')?.setValue(slug);
    }
  }

  onThumbnailImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.thumbnailFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.thumbnailPreview.set(e.target?.result as string);
      reader.readAsDataURL(this.thumbnailFile!);
    }
  }

  removeThumbnail(): void {
    this.thumbnailFile = null;
    this.thumbnailPreview.set(null);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['minlength']) return `${fieldName} is too short`;
    if (control.errors['min']) return `${fieldName} must be >= 0`;
    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const formValue = this.form.value;

    const dto: UpdateCategoryDto = {
      id: this.categoryId,
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description || '',
      metaTitle: formValue.metaTitle || '',
      metaKeywords: formValue.metaKeywords || '',
      metaDescription: formValue.metaDescription || '',
      displayOrder: formValue.displayOrder ?? 0,
      parentId: formValue.parentId || '',
      includeInMenu: formValue.includeInMenu ?? true,
      isPublished: formValue.isPublished ?? true,
      thumbnailImageUrl: formValue.thumbnailImageUrl || '',
    };

    this.categoryService.updateCategory(dto, this.thumbnailFile ?? undefined).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        console.log(err)
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.message || 'Failed to update category');
      },
    });
  }
}
