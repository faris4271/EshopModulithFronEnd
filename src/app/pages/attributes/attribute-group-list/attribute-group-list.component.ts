import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AttributeGroupService } from '../../../services/attribute-group.service';
import { AttributeGroup } from '../../../models/attribute-group.model';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-attribute-group-list',
  standalone: true,
  imports: [RouterLink, CommonModule, ConfirmationDialogComponent],
  templateUrl: './attribute-group-list.component.html',
  styleUrl: './attribute-group-list.component.css',
})
export class AttributeGroupListComponent implements OnInit {
  private groupService = inject(AttributeGroupService);

  Math = Math;

  allGroups = signal<AttributeGroup[]>([]);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  groupToDelete = signal<AttributeGroup | null>(null);

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe((groups) => {
      this.allGroups.set(groups);
    });
  }

  filteredGroups = computed(() => {
    let result = this.allGroups();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(search) ,
      );
    }
    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredGroups().length / this.pageSize()));
  paginatedGroups = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredGroups().slice(start, start + this.pageSize());
  });

  deleteGroup(group: AttributeGroup): void {
    this.groupToDelete.set(group);
  }

  cancelDelete(): void {
    this.groupToDelete.set(null);
  }

  confirmDelete(): void {
    const group = this.groupToDelete();
    if (group) {
      this.groupService.deleteGroup(group.id).subscribe(() => {
        this.loadGroups();
        this.cancelDelete();
      });
    }
  }
}
