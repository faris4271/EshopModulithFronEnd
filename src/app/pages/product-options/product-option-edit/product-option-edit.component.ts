import { Component, inject, signal, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink, isActive } from '@angular/router';
import { ProductOptionService } from '../../../services/product-option.service';
import { ProductOption, OptionStatus, UpdateProductOptionDto } from '../../../models/product-option.model';

@Component({
  selector: 'app-product-option-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-option-edit.component.html',
  styleUrl: './product-option-edit.component.css',
})
export class ProductOptionEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private optionService = inject(ProductOptionService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  optionNotFound = signal(false);

  private optionId = String(this.route.snapshot.paramMap.get('id'));

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    status: [OptionStatus.Active],
  });

  ngOnInit(): void {
    this.optionService.getOptionById(this.optionId).subscribe({
      next: (option) => {
        if (!option) {
          this.optionNotFound.set(true);
          return;
        }
        this.form.patchValue({
          name: option.name,
         
        });
      },
      error: () => {
        this.optionNotFound.set(true);
      },
    });
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

    const option: UpdateProductOptionDto = {
      id: this.optionId,
      name: formValue.name,
      
    };

    this.optionService.updateOption(option).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/product-options']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.message || 'Failed to update option');
      },
    });
  }
}
