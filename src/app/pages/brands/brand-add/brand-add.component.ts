import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { CreateBrandDto } from '../../../models/brand.model';

@Component({
  selector: 'app-brand-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './brand-add.component.html',
  styleUrl: './brand-add.component.css',
})
export class BrandAddComponent {
  private fb = inject(FormBuilder);
  private brandService = inject(BrandService);
  router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required]],
    description: [''],
    isPublished: [true],
  });

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

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['minlength']) return `${fieldName} is too short`;
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

    const dto: CreateBrandDto = {
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description || '',
      isPublished: formValue.isPublished ?? true,
    };

    this.brandService.createBrand(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/brands']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.message || 'Failed to create brand');
      },
    });
  }
}
