import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Lock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  authService = inject(AuthService);

  // Icons
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly Camera = Camera;
  readonly Save = Save;
  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle2 = CheckCircle2;

  // State
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isLoadingProfile = signal(false);
  isUpdatingProfile = signal(false);
  isUpdatingPassword = signal(false);
  profileSuccessMessage = signal<string | null>(null);
  profileErrorMessage = signal<string | null>(null);
  passwordSuccessMessage = signal<string | null>(null);
  passwordErrorMessage = signal<string | null>(null);

  ngOnInit() {
    this.initializeForms();
    this.loadUserProfile();
  }

  initializeForms() {
    // Profile form
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    });

    // Password form
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  loadUserProfile() {
    this.isLoadingProfile.set(true);
    const currentUser = this.authService.currentUser();

    if (currentUser) {
      this.http.get<UserProfile>(`http://localhost:8080/api/users/profile`).subscribe({
        next: (profile) => {
          console.log('Profile loaded:', profile);

          this.profileForm.patchValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            address: profile.address,
          });
          if (profile.avatarUrl) {
            // Add cache busting timestamp to force reload of updated avatar
            const timestamp = new Date().getTime();
            // Prepend base URL if avatar is a relative path
            const avatarUrl = profile.avatarUrl.startsWith('http')
              ? `${profile.avatarUrl}?t=${timestamp}`
              : `http://localhost:8080${profile.avatarUrl}?t=${timestamp}`;
            console.log('Avatar URL with cache busting:', avatarUrl);
            this.previewUrl.set(avatarUrl);
          }
          this.isLoadingProfile.set(false);
        },
        error: (error) => {
          console.error('Failed to load profile:', error);
          this.isLoadingProfile.set(false);
        },
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.profileErrorMessage.set('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.profileErrorMessage.set('Image size must be less than 5MB');
        return;
      }

      this.selectedFile.set(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isUpdatingProfile.set(true);
    this.profileSuccessMessage.set(null);
    this.profileErrorMessage.set(null);

    const formData = new FormData();
    formData.append('firstName', this.profileForm.get('firstName')?.value);
    formData.append('lastName', this.profileForm.get('lastName')?.value);
    formData.append('email', this.profileForm.get('email')?.value);
    formData.append('phoneNumber', this.profileForm.get('phoneNumber')?.value);
    formData.append('address', this.profileForm.get('address')?.value);

    if (this.selectedFile()) {
      formData.append('avatar', this.selectedFile()!);
    }

    this.http.put<UserProfile>('http://localhost:8080/api/users/profile', formData).subscribe({
      next: (response) => {
        console.log('Profile update response:', response);
        console.log('Avatar URL from backend:', response.avatarUrl);

        this.profileSuccessMessage.set('Profile updated successfully!');
        this.isUpdatingProfile.set(false);
        this.selectedFile.set(null);

        // Update auth service with new user data including avatar
        this.authService.updateUserProfile({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          avatarUrl: response.avatarUrl,
        });

        // Reload the profile to get the updated avatar URL
        this.loadUserProfile();

        setTimeout(() => this.profileSuccessMessage.set(null), 3000);
      },
      error: (error) => {
        this.profileErrorMessage.set(
          error.error?.message || 'Failed to update profile. Please try again.'
        );
        this.isUpdatingProfile.set(false);
      },
    });
  }

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isUpdatingPassword.set(true);
    this.passwordSuccessMessage.set(null);
    this.passwordErrorMessage.set(null);

    const passwordData = {
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
    };

    this.http.put('http://localhost:8080/api/users/password', passwordData).subscribe({
      next: () => {
        this.passwordSuccessMessage.set('Password updated successfully!');
        this.isUpdatingPassword.set(false);
        this.passwordForm.reset();
        setTimeout(() => this.passwordSuccessMessage.set(null), 3000);
      },
      error: (error) => {
        this.passwordErrorMessage.set(
          error.error?.message || 'Failed to update password. Please check your current password.'
        );
        this.isUpdatingPassword.set(false);
      },
    });
  }

  getFieldError(formGroup: FormGroup, fieldName: string): string | null {
    const field = formGroup.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return 'This field is required';
      if (field.errors?.['email']) return 'Please enter a valid email';
      if (field.errors?.['minlength'])
        return `Minimum ${field.errors?.['minlength'].requiredLength} characters required`;
      if (field.errors?.['pattern']) return 'Please enter a valid phone number';
    }
    return null;
  }
}
