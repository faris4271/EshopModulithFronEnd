import { Component, inject, signal, computed } from '@angular/core';
import { AttributeGroupService } from '../../../services/attribute-group.service';
import { AttributeGroup, AttributeGroupStatus } from '../../../models/attribute-group.model';

@Component({
  selector: 'app-attribute-group-list',
  standalone: true,
  imports: [],
  templateUrl: './attribute-group-list.component.html',
  styleUrl: './attribute-group-list.component.css',
})
export class AttributeGroupListComponent {
  private groupService = inject(AttributeGroupService);

  AttributeGroupStatus = AttributeGroupStatus;
  Math = Math;

  allGroups = signal(this.groupService.getGroups());
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);

  filteredGroups = computed(() => {
    let result = this.allGroups();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(search) || g.description.toLowerCase().includes(search),
      );
    }
    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredGroups().length / this.pageSize()));
  paginatedGroups = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredGroups().slice(start, start + this.pageSize());
  });

  deleteGroup(id: number): void {
    if (confirm('Are you sure you want to delete this attribute group?')) {
      this.groupService.deleteGroup(id);
      this.allGroups.set(this.groupService.getGroups());
    }
  }

  getStatusBadgeClass(status: AttributeGroupStatus): string {
    return this.groupService.getStatusColor(status);
  }

  getStatusName(status: AttributeGroupStatus): string {
    return this.groupService.getStatusName(status);
  }
}
