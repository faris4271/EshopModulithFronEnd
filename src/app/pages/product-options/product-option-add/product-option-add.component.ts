import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductOptionService } from '../../../services/product-option.service';
import { OptionStatus, CreateProductOptionDto } from '../../../models/product-option.model';

@Component({
  selector: 'app-product-option-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-option-add.component.html',
  styleUrl: './product-option-add.component.css',
})
export class ProductOptionAddComponent {
  private fb = inject(FormBuilder);
  private optionService = inject(ProductOptionService);
  router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    status: [OptionStatus.Active],
  });

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

    const option: CreateProductOptionDto = {
      name: formValue.name,
    
    };

    this.optionService.createOption(option).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/product-options']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.message || 'Failed to create option');
      },
    });
  }
}
