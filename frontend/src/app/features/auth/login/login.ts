import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Mail, Lock, LogIn } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Icons
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly LogIn = LogIn;

  loginForm: FormGroup;
  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.valid) {
      this.isSubmitting = true;

      const loginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          // Show success state
          this.isSuccess = true;
          this.successMessage = 'Login successful! Redirecting...';

          // Refresh user profile to get latest avatar and data
          this.authService.refreshUserProfile().subscribe({
            next: () => {
              console.log('User profile refreshed after login');
            },
            error: (error) => {
              console.error('Error refreshing profile:', error);
              // Don't block login on profile refresh error
            },
          });

          // Delay for smooth transition
          setTimeout(() => {
            this.isSubmitting = false;

            // Navigate based on user role
            if (response.role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/dogs']);
            }
          }, 1500); // 1.5 second delay for animation
        },
        error: (error) => {
          this.isSubmitting = false;
          this.isSuccess = false;
          console.error('Login error:', error);

          if (error.status === 400 || error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
