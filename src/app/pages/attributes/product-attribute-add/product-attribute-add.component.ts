import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { ToastService } from '../../../services/toast.service';
import { AttributeGroup } from '../../../models/attribute-group.model';
import { AttributeGroupService } from '../../../services/attribute-group.service';

@Component({
  selector: 'app-product-attribute-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-attribute-add.component.html',
  styleUrl: './product-attribute-add.component.css',
})
export class ProductAttributeAddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private attributeService = inject(ProductAttributeService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private attributeGroupService = inject(AttributeGroupService);
   
  isAttributeDropdownOpen = signal<boolean>(false);
  attributeGroups = signal<AttributeGroup[]>([]);
  
  attributeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    groupId: ['', [Validators.required]],
    groupName: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.getAttributeGroups();
  }

  getAttributeGroups(): void {
    this.attributeGroupService.getGroups().subscribe({
      next: (values) => this.attributeGroups.set(values),
      error: (err) => this.toastService.error(err.message || 'Failed to load groups')  
    });
  }

  toggleDropdown(): void {
    this.isAttributeDropdownOpen.update(v => !v);
  }

  selectAttributeGroup(group: AttributeGroup): void {
   
    this.attributeForm.patchValue({
      groupId: group.id,
      groupName: group.name
    });
    this.isAttributeDropdownOpen.set(false);
  }

  saveAttribute(): void {
    if (this.attributeForm.invalid) {
      this.attributeForm.markAllAsTouched();
      return;
    }

    const attributeData = this.attributeForm.value;
    this.attributeService.addAttribute(attributeData).subscribe({
      next: () => {
        this.toastService.success('Product attribute added successfully!');
        this.router.navigate(['/attributes']);
      },
      error: (err) => {
        this.toastService.error('Failed to add product attribute');
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/attributes']);
  }
}
