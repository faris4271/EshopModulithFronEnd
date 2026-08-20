import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaxClassService } from '../../../services/tax-class.service';
import { TaxClassCreatePayload } from '../../../models/tax-class.model';

@Component({
  selector: 'app-tax-class-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tax-class-add.component.html',
})
export class TaxClassAddComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private taxClassService = inject(TaxClassService);
  
  taxClassForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSave(): void {
    if (this.taxClassForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: TaxClassCreatePayload = {
      name: this.taxClassForm.value.name,
    };
    
    this.taxClassService.addTaxClass(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/system/tax-classes']);
      },
      error: (err) => {
        this.errorMessage.set('An error occurred while creating the tax class.');
        this.isLoading.set(false);
        console.error('Error adding tax class:', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/system/tax-classes']);
  }
}
