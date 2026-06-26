import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AttributeGroupService } from '../../../services/attribute-group.service';
import { AttributeGroup, AttributeGroupUpdatePayload } from '../../../models/attribute-group.model';

@Component({
  selector: 'app-attribute-group-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attribute-group-edit.component.html',
})
export class AttributeGroupEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private groupService = inject(AttributeGroupService);
  
  groupForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadGroup(id);
    } else {
      this.errorMessage.set('No attribute group ID provided.');
    }
  }

  loadGroup(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.groupService.getGroupById(id).subscribe({
      next: (group) => {
        this.groupForm.patchValue(group);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load attribute group. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading group:', err);
      },
    });
  }

  onSave(): void {
    if (this.groupForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.groupForm.value;
    const payload: AttributeGroupUpdatePayload = {
      id: formValue.id,
      name: formValue.name,
    };
    
    this.groupService.updateGroup(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/attributes/attribute-groups']);
      },
      error: (err) => {
        this.errorMessage.set('An error occurred while saving the attribute group.');
        this.isLoading.set(false);
        console.error('Error updating group:', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/attribute-groups']);
  }
}
