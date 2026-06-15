import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { Brand, UpdateBrandDto } from '../../../models/brand.model';

@Component({
  selector: 'app-brand-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './brand-edit.component.html',
  styleUrl: './brand-edit.component.css',
})
export class BrandEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private brandService = inject(BrandService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  brandNotFound = signal(false);

  private brandId = this.route.snapshot.paramMap.get('id') || '';

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required]],
    description: [''],
    isPublished: [true],
  });

  ngOnInit(): void {
    this.brandService.getBrandById(this.brandId).subscribe({
      next: (brand: Brand) => {
        this.form.patchValue({
          name: brand.name,
          slug: brand.slug,
          description: brand.description,
          isPublished: brand.isPublished,
        });
      },
      error: () => {
        this.brandNotFound.set(true);
      },
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

    const dto: UpdateBrandDto = {
      id: this.brandId,
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description || '',
      isPublished: formValue.isPublished ?? true,
    };

    this.brandService.updateBrand(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/brands']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.message || 'Failed to update brand');
      },
    });
  }
}
