import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';
import { VendorDto } from '../../../models/vendor.model';

@Component({
  selector: 'app-vendor-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vendor-add.component.html',
  styleUrl: './vendor-add.component.css',
})
export class VendorAddComponent {
  private fb = inject(FormBuilder);
  private vendorService = inject(VendorService);
  router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    description: [''],
    isActive: [true],
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
    if (control.errors['email']) return 'Invalid email format';
    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const dto: VendorDto = this.form.getRawValue();

    this.vendorService.createVendor(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/vendors']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.message || 'Failed to create vendor');
      },
    });
  }
}