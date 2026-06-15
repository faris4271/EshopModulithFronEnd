import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductOptionAddComponent } from './product-option-add.component';
import { ProductOptionService } from '../../../services/product-option.service';
import { ProductOption, OptionStatus } from '../../../models/product-option.model';

// Mock the Router
const mockRouter = {
  navigate: jest.fn().mockResolvedValue(true),
} as unknown as Router;

// Mock the ProductOptionService
const mockProductOptionService = {
  createOption: jest.fn().mockReturnValue({ subscribe: (observer: any) => observer.next() }),
} as unknown as ProductOptionService;

describe('ProductOptionAddComponent', () => {
  let component: ProductOptionAddComponent;
  let fixture: ComponentFixture<ProductOptionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductOptionAddComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: ProductOptionService, useValue: mockProductOptionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductOptionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct default values', () => {
    expect(component.form).toBeInstanceOf(FormGroup);
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('displayType')?.value).toBe('dropdown');
    expect(component.form.get('values')?.value).toEqual([]);
    expect(component.form.get('status')?.value).toBe(OptionStatus.Active);
  });

  it('should have required form controls', () => {
    const nameControl = component.form.get('name');
    const displayTypeControl = component.form.get('displayType');
    const valuesControl = component.form.get('values');
    const statusControl = component.form.get('status');

    expect(nameControl?.validator).toBeDefined();
    expect(displayTypeControl?.validator).toBeDefined();
    expect(valuesControl?.validator).toBeDefined();
    expect(statusControl?.validator).toBeDefined();
  });

  it('should add a value to the form array', () => {
    const initialLength = component.valuesControls.length;
    component.addValue();
    expect(component.valuesControls.length).toBe(initialLength + 1);
  });

  it('should not add empty values', () => {
    component.form.patchValue({ name: 'Test' });
    component.addValue();
    expect(component.valuesControls.length).toBe(1);
    expect(component.valuesControls[0].value).toBe('');
  });

  it('should remove a value from the form array', () => {
    component.addValue();
    component.addValue();
    expect(component.valuesControls.length).toBe(2);
    
    component.removeValue(0);
    expect(component.valuesControls.length).toBe(1);
  });

  it('should validate required field for name', () => {
    const nameControl = component.form.get('name');
    nameControl?.markAsTouched();
    expect(component.isFieldInvalid('name')).toBe(true);
    expect(component.getErrorMessage('name')).toBe('name is required');
  });

  it('should validate min length for name', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('a');
    nameControl?.markAsTouched();
    expect(component.isFieldInvalid('name')).toBe(true);
    expect(component.getErrorMessage('name')).toBe('name is too short');
  });

  it('should validate required field for displayType', () => {
    const displayTypeControl = component.form.get('displayType');
    displayTypeControl?.markAsTouched();
    expect(component.isFieldInvalid('displayType')).toBe(true);
  });

  it('should validate required field for status', () => {
    const statusControl = component.form.get('status');
    statusControl?.markAsTouched();
    expect(component.isFieldInvalid('status')).toBe(true);
  });

  it('should return empty error message for valid field', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('Test');
    nameControl?.markAsTouched();
    expect(component.isFieldInvalid('name')).toBe(false);
    expect(component.getErrorMessage('name')).toBe('');
  });

  it('should submit form with valid data', () => {
    component.form.patchValue({
      name: 'Color',
      displayType: 'color',
      values: ['Red', 'Blue'],
      status: OptionStatus.Active,
    });

    component.onSubmit();

    expect(mockProductOptionService.createOption).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/product-options']);
  });

  it('should not submit form when invalid', () => {
    component.form.markAllAsTouched();
    component.onSubmit();
    expect(mockProductOptionService.createOption).not.toHaveBeenCalled();
  });

  it('should handle service error', (done) => {
    const errorMessage = 'Test error';
    mockProductOptionService.createOption = jest.fn().mockReturnValue({
      subscribe: {
        next: jest.fn(),
        error: (observer: any) => observer.error(errorMessage),
      },
    } as any);

    component.form.patchValue({
      name: 'Color',
      displayType: 'color',
      values: ['Red'],
      status: OptionStatus.Active,
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage()).toBe(errorMessage);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should display display type labels correctly', () => {
    expect(component.displayTypes).toEqual([
      { value: 'dropdown', label: 'Dropdown' },
      { value: 'color', label: 'Color Picker' },
      { value: 'text', label: 'Text Input' },
      { value: 'radio', label: 'Radio Buttons' },
      { value: 'checkbox', label: 'Checkboxes' },
    ]);
  });

  it('should get display type name from service', () => {
    expect(component['optionService'].getDisplayTypeName('color')).toBe('Color Picker');
    expect(component['optionService'].getDisplayTypeName('dropdown')).toBe('Dropdown');
    expect(component['optionService'].getDisplayTypeName('unknown')).toBe('unknown');
  });

  it('should get status name from service', () => {
    expect(component['optionService'].getStatusName(OptionStatus.Active)).toBe('Active');
    expect(component['optionService'].getStatusName(OptionStatus.Inactive)).toBe('Inactive');
  });

  it('should get status color from service', () => {
    expect(component['optionService'].getStatusColor(OptionStatus.Active)).toContain('bg-green-50');
    expect(component['optionService'].getStatusColor(OptionStatus.Inactive)).toContain('bg-red-50');
  });

  it('should generate unique IDs for new options', () => {
    const existingMaxId = Math.max(...mockProductOptionService['options'].map((o: ProductOption) => o.id));
    component.form.patchValue({
      name: 'New Option',
      displayType: 'text',
      values: ['Value1'],
      status: OptionStatus.Active,
    });
    component.onSubmit();
    const newOption = mockProductOptionService.createOption.mock.calls[0][0] as ProductOption;
    expect(newOption.id).toBe(existingMaxId + 1);
  });

  it('should filter out empty values on submit', () => {
    component.form.patchValue({
      name: 'Test',
      displayType: 'text',
      values: ['Value1', '', 'Value2', ''],
      status: OptionStatus.Active,
    });
    component.onSubmit();
    const submittedValues = mockProductOptionService.createOption.mock.calls[0][0] as any;
    expect(submittedValues.values).toEqual(['Value1', 'Value2']);
  });
});