import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-attribute-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-attribute-add.component.html',
  styleUrl: './product-attribute-add.component.css',
})
export class ProductAttributeAddComponent {
  private fb = inject(FormBuilder);
  private attributeService = inject(ProductAttributeService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  attributeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    groupId: ['', [Validators.required]],
    groupName: ['', [Validators.required]],
  });

  saveAttribute(): void {
    if (this.attributeForm.invalid) {
      this.attributeForm.markAllAsTouched();
      return;
    }

    const attributeData = this.attributeForm.value;
    this.attributeService.addAttribute(attributeData);
    this.toastService.success('Product attribute added successfully!');
    this.router.navigate(['/attributes/product-attribute-list']);
  }

  cancel(): void {
    this.router.navigate(['/attributes/product-attribute-list']);
  }
}
