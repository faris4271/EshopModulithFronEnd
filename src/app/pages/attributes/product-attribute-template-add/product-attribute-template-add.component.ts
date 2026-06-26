import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductAttributeTemplateService } from '../../../services/product-attribute-template.service';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { ProductAttribute } from '../../../models/product-attribute.model';

@Component({
  selector: 'app-product-attribute-template-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-attribute-template-add.component.html',
})
export class ProductAttributeTemplateAddComponent implements OnInit {
  private templateService = inject(ProductAttributeTemplateService);
  private attributeService = inject(ProductAttributeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form: FormGroup;
  
  allAvailableAttributes = signal<ProductAttribute[]>([]);
  addedAttributes = signal<ProductAttribute[]>([]);
  
  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      attributeIds: [[] as string[], [Validators.required, Validators.minLength(1)]]
    });
  }

  groupedAttributes = computed(() => {
    const groups: Record<string, ProductAttribute[]> = {};
    const addedIds = new Set(this.addedAttributes().map(a => a.id));
    
    this.allAvailableAttributes().forEach(attr => {
      if (addedIds.has(attr.id)) return;
      
      if (!groups[attr.groupName]) {
        groups[attr.groupName] = [];
      }
      groups[attr.groupName].push(attr);
    });
    return groups;
  });

  ngOnInit(): void {
    this.attributeService.getAttributes().subscribe(attrs => {
      this.allAvailableAttributes.set(attrs);
    });
  }

  addAttribute(attributeId: string): void {
    const attr = this.allAvailableAttributes().find(a => a.id === attributeId);
    if (attr && !this.addedAttributes().find(a => a.id === attr.id)) {
      this.addedAttributes.update(list => [...list, attr]);
      this.form.get('attributeIds')?.setValue(this.addedAttributes().map(a => a.id));
    }
  }

  removeAttribute(id: string): void {
    this.addedAttributes.update(list => list.filter(a => a.id !== id));
    this.form.get('attributeIds')?.setValue(this.addedAttributes().map(a => a.id));
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      templetDto: {
        name: this.form.value.name,
        attributeIds: this.form.value.attributeIds
      }
    };

    this.templateService.addAttributeTemplate(payload).subscribe(() => {
      this.router.navigate(['/attributes/templates']);
    });
  }
}
