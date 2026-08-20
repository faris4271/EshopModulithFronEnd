import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaxClassService } from '../../../services/tax-class.service';
import { TaxClass, TaxClassUpdatePayload } from '../../../models/tax-class.model';

@Component({
  selector: 'app-tax-class-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tax-class-edit.component.html',
})
export class TaxClassEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private taxClassService = inject(TaxClassService);
  
  taxClassForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTaxClass(id);
    } else {
      this.errorMessage.set('No tax class ID provided.');
    }
  }

  loadTaxClass(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.taxClassService.getTaxClassById(id).subscribe({
      next: (taxClass) => {
        this.taxClassForm.patchValue(taxClass);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load tax class. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading tax class:', err);
      },
    });
  }

  onSave(): void {
    if (this.taxClassForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.taxClassForm.value;
    const payload: TaxClassUpdatePayload = {
      id: formValue.id,
      name: formValue.name,
    };
    
    this.taxClassService.updateTaxClass(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/system/tax-classes']);
      },
      error: (err) => {
        this.errorMessage.set('An error occurred while saving the tax class.');
        this.isLoading.set(false);
        console.error('Error updating tax class:', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/system/tax-classes']);
  }
}
