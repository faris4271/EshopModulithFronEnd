import { Injectable } from '@angular/core';
import { ProductAttribute } from '../models/product-attribute.model';

@Injectable({ providedIn: 'root' })
export class ProductAttributeService {
  private attributes: ProductAttribute[] = [
    {
      id: '1',
      name: 'Color',
      groupId: '1',
      groupName: 'General',
    },
    {
      id: '2',
      name: 'Material',
      groupId: '1',
      groupName: 'General',
    },
    {
      id: '3',
      name: 'Weight',
      groupId: '1',
      groupName: 'General',
    },
    {
      id: '4',
      name: 'Screen Size',
      groupId: '2',
      groupName: 'Electronics',
    },
    {
      id: '5',
      name: 'RAM',
      groupId: '2',
      groupName: 'Electronics',
    },
    {
      id: '6',
      name: 'Storage',
      groupId: '2',
      groupName: 'Electronics',
    },
    {
      id: '7',
      name: 'Battery Life',
      groupId: '2',
      groupName: 'Electronics',
    },
    {
      id: '8',
      name: 'Wireless',
      groupId: '2',
      groupName: 'Electronics',
    },
    {
      id: '9',
      name: 'Size',
      groupId: '3',
      groupName: 'Clothing',
    },
    {
      id: '10',
      name: 'Fabric',
      groupId: '3',
      groupName: 'Clothing',
    },
    {
      id: '11',
      name: 'Dimensions',
      groupId: '4',
      groupName: 'Home & Furniture',
    },
    {
      id: '12',
      name: 'Assembly Required',
      groupId: '4',
      groupName: 'Home & Furniture',
    },
    {
      id: '13',
      name: 'Finish',
      groupId: '4',
      groupName: 'Home & Furniture',
    },
    {
      id: '14',
      name: 'Skill Level',
      groupId: '5',
      groupName: 'Hobby',
    },
    {
      id: '15',
      name: 'Skin Type',
      groupId: '6',
      groupName: 'Beauty',
    },
  ];

  getAttributes(): ProductAttribute[] {
    return [...this.attributes];
  }

  getAttributeById(id: string): ProductAttribute | undefined {
    return this.attributes.find((a) => a.id === id);
  }

  addAttribute(attribute: Omit<ProductAttribute, 'id'>): ProductAttribute {
    const newAttribute: ProductAttribute = {
      ...attribute,
      id: (this.attributes.length + 1).toString(),
    };
    this.attributes.push(newAttribute);
    return newAttribute;
  }

  updateAttribute(attribute: ProductAttribute): void {
    const index = this.attributes.findIndex((a) => a.id === attribute.id);
    if (index !== -1) {
      this.attributes[index] = attribute;
    }
  }

  deleteAttribute(id: string): void {
    this.attributes = this.attributes.filter((a) => a.id !== id);
  }
}
