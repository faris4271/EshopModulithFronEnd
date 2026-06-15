import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showPassword = signal(false);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), this.passwordComplexityValidator]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const isValid = specialCharRegex.test(value);
    return isValid ? null : { complexity: true };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register data:', this.registerForm.value);
      // Implementation for registration would go here
      this.router.navigate(['/login']);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
