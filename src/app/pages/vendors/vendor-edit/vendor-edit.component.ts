import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';
import { VendorDto } from '../../../models/vendor.model';

@Component({
  selector: 'app-vendor-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vendor-edit.component.html',
  styleUrl: './vendor-edit.component.css',
})
export class VendorEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vendorService = inject(VendorService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  private vendorId = (this.route.snapshot.paramMap.get('id') || "");

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    description: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this.vendorService.getVendorById(this.vendorId).subscribe({
      next: (vendor) => {
        this.form.patchValue({
          name: vendor.name,
          slug: vendor.slug,
          email: vendor.email,
          isActive: vendor.isActive,
        });
      },
      error: (err) => {
        this.errorMessage.set('Failed to load vendor');
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
    const formValue = this.form.getRawValue();

    const dto: VendorDto = {
      id: this.vendorId,
      ...formValue
    };

    this.vendorService.updateVendor(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/vendors']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.message || 'Failed to update vendor');
      },
    });
  }
}
