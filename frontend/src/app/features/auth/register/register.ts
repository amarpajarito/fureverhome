import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  LucideAngularModule,
  User,
  Mail,
  Lock,
  Phone,
  UserPlus,
  CheckCircle,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Icons
  readonly User = User;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Phone = Phone;
  readonly UserPlus = UserPlus;
  readonly CheckCircle = CheckCircle;

  registerForm: FormGroup;
  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.registerForm.valid) {
      this.isSubmitting = true;

      const registerRequest = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        phoneNumber: this.registerForm.value.phoneNumber,
        password: this.registerForm.value.password,
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          // Show success state
          this.isSuccess = true;
          this.successMessage = 'Registration successful! Setting up your account...';

          // Delay for smooth transition
          setTimeout(() => {
            this.isSubmitting = false;

            // Navigate based on user role (usually USER for new registrations)
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
          console.error('Registration error:', error);

          if (error.status === 400) {
            this.errorMessage = 'Email already exists';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
