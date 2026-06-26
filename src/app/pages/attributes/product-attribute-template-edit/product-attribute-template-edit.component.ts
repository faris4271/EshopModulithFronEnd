import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductAttributeTemplateService } from '../../../services/product-attribute-template.service';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { ProductAttribute } from '../../../models/product-attribute.model';
import { ProductAttributeTemplate } from '../../../models/product-attribute-template.model';

@Component({
  selector: 'app-product-attribute-template-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-attribute-template-edit.component.html',
})
export class ProductAttributeTemplateEditComponent implements OnInit {
  private templateService = inject(ProductAttributeTemplateService);
  private attributeService = inject(ProductAttributeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  templateId: string | null = null;
  
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
    this.templateId = this.route.snapshot.paramMap.get('id');
    
    this.attributeService.getAttributes().subscribe(attrs => {
      this.allAvailableAttributes.set(attrs);
      if (this.templateId) {
        this.templateService.getAttributeTemplateById(this.templateId).subscribe(template => {
          this.form.patchValue({ 
            name: template.name,
            attributeIds: template.attributes.map(a => a.id)
          });
          this.addedAttributes.set(template.attributes.map(a => ({
              id: a.id,
              name: a.name,
              groupId: '', // Not provided by the API
              groupName: a.groupName
          })));
        });
      }
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
        id: this.templateId!,
        name: this.form.value.name,
        attributeIds: this.form.value.attributeIds
      }
    };

    this.templateService.updateAttributeTemplate(payload).subscribe(() => {
      this.router.navigate(['/attributes/templates']);
    });
  }
}
