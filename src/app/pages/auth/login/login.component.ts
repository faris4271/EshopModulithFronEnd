import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import th from '@angular/common/locales/th';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth=inject(AuthService)
  showPassword = signal(false);
  private toastr = inject(ToastrService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      this.auth.login(this.loginForm.value).subscribe({
        next: (value) => {
          this.router.navigateByUrl('/categories');
        },
        error: (err) => {
          console.log(err)
          this.toastr.error(err?.message || 'Login failed');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
