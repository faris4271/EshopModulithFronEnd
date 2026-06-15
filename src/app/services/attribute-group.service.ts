import { Injectable } from '@angular/core';
import { AttributeGroup, AttributeGroupStatus } from '../models/attribute-group.model';

@Injectable({ providedIn: 'root' })
export class AttributeGroupService {
  private groups: AttributeGroup[] = [
    {
      id: 1,
      name: 'General',
      description: 'General product attributes like material, weight, dimensions',
      sort_order: 1,
      status: AttributeGroupStatus.Active,
      total_attributes: 4,
      created_at: '2025-01-15',
    },
    {
      id: 2,
      name: 'Electronics',
      description: 'Technical specs for electronic products',
      sort_order: 2,
      status: AttributeGroupStatus.Active,
      total_attributes: 5,
      created_at: '2025-01-20',
    },
    {
      id: 3,
      name: 'Clothing',
      description: 'Size, fabric, and fit attributes for clothing items',
      sort_order: 3,
      status: AttributeGroupStatus.Active,
      total_attributes: 3,
      created_at: '2025-02-01',
    },
    {
      id: 4,
      name: 'Furniture',
      description: 'Dimensions, material, and assembly attributes for furniture',
      sort_order: 4,
      status: AttributeGroupStatus.Active,
      total_attributes: 4,
      created_at: '2025-02-10',
    },
    {
      id: 5,
      name: 'Sports',
      description: 'Performance and equipment attributes for sports products',
      sort_order: 5,
      status: AttributeGroupStatus.Inactive,
      total_attributes: 2,
      created_at: '2025-03-01',
    },
    {
      id: 6,
      name: 'Beauty',
      description: 'Ingredients, skin type, and volume attributes for beauty products',
      sort_order: 6,
      status: AttributeGroupStatus.Active,
      total_attributes: 3,
      created_at: '2025-03-15',
    },
  ];

  getGroups(): AttributeGroup[] {
    return [...this.groups];
  }

  getGroupById(id: number): AttributeGroup | undefined {
    return this.groups.find((g) => g.id === id);
  }

  addGroup(group: Omit<AttributeGroup, 'id' | 'created_at'>): AttributeGroup {
    const newGroup: AttributeGroup = {
      ...group,
      id: Math.max(...this.groups.map((g) => g.id)) + 1,
      created_at: new Date().toISOString().split('T')[0],
    };
    this.groups.push(newGroup);
    return newGroup;
  }

  updateGroup(group: AttributeGroup): void {
    const index = this.groups.findIndex((g) => g.id === group.id);
    if (index !== -1) {
      this.groups[index] = group;
    }
  }

  deleteGroup(id: number): void {
    this.groups = this.groups.filter((g) => g.id !== id);
  }

  getStatusName(status: AttributeGroupStatus): string {
    return status === AttributeGroupStatus.Active ? 'Active' : 'Inactive';
  }

  getStatusColor(status: AttributeGroupStatus): string {
    return status === AttributeGroupStatus.Active
      ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
      : 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
  }
}
