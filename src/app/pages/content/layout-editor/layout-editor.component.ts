import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';
import { LayoutDto, CreateLayoutDto, UpdateLayoutDto, LayoutListItem } from '../../../models/layout.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-layout-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './layout-editor.component.html',
  styleUrl: './layout-editor.component.css',
})
export class LayoutEditorComponent implements OnInit {
  private layoutService = inject(LayoutService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isEditing = signal(false);
  layoutId = signal<string | null>(null);
  isSubmitting = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    slug: ['', [Validators.required, Validators.maxLength(200), Validators.pattern(/^[a-z0-9-]+$/)]],
    description: [''],
    blocks: ['[]'],
    isDefault: [false],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.layoutId.set(id);
    }
  }

  ngOnInit(): void {
    if (!this.isEditing()) {
      this.resetForm();
    } else if (this.layoutId()) {
      this.loadLayout(this.layoutId()!);
    }

    // Auto-generate slug from name
    this.form.get('name')?.valueChanges.subscribe(value => {
      if (value && !this.form.get('slug')?.dirty) {
        this.form.get('slug')?.setValue(this.generateSlug(value));
      }
    });
  }

  loadLayout(id: string): void {
    this.layoutService.getLayoutById(id).subscribe({
      next: (layout) => this.populateForm(layout),
      error: (err) => {
        console.error('Failed to load layout:', err);
        this.toastService.error('Failed to load layout');
        this.router.navigate(['/content/layouts']);
      },
    });
  }

  populateForm(layout: LayoutDto): void {
    this.form.patchValue({
      name: layout.name,
      slug: layout.slug,
      description: layout.description || '',
      blocks: layout.blocks || '[]',
      isDefault: layout.isDefault,
    });
  }

  resetForm(): void {
    this.form.reset({
      name: '',
      slug: '',
      description: '',
      blocks: '[]',
      isDefault: false,
    });
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Please correct the errors in the form');
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.getRawValue();
    const dto: CreateLayoutDto | UpdateLayoutDto = {
      name: formValue.name!,
      slug: formValue.slug!,
      description: formValue.description || undefined,
      blocks: formValue.blocks || '[]',
      isDefault: formValue.isDefault ?? false,
    };

    const request = this.isEditing()
      ? this.layoutService.updateLayout(this.layoutId()!, dto as UpdateLayoutDto)
      : this.layoutService.createLayout(dto as CreateLayoutDto);

    request.subscribe({
      next: () => {
        this.toastService.success(this.isEditing() ? 'Layout updated successfully' : 'Layout created successfully');
        this.isSubmitting.set(false);
        this.router.navigate(['/content/layouts']);
      },
      error: (err) => {
        console.error('Failed to save layout:', err);
        this.toastService.error(this.isEditing() ? 'Failed to update layout' : 'Failed to create layout');
        this.isSubmitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/content/layouts']);
  }
}