import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AttributeGroupService } from '../../../services/attribute-group.service';
import { AttributeGroupCreatePayload } from '../../../models/attribute-group.model';

@Component({
  selector: 'app-attribute-group-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attribute-group-add.component.html',
})
export class AttributeGroupAddComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private groupService = inject(AttributeGroupService);
  
  groupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSave(): void {
    if (this.groupForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: AttributeGroupCreatePayload = {
      name: this.groupForm.value.name,
    };
    
    this.groupService.addGroup(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/attribute-groups']);
      },
      error: (err) => {
        this.errorMessage.set('An error occurred while creating the attribute group.');
        this.isLoading.set(false);
        console.error('Error adding group:', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/attribute-groups']);
  }
}
