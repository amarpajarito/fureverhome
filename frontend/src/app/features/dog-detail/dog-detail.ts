import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  ArrowLeft,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  Briefcase,
  Users,
  PawPrint,
  CheckCircle,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { Dog } from '../dogs/dogs';

interface AdoptionRequest {
  dogId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  householdMembers: number;
  hasOtherPets: boolean;
  petExperience: string;
  reason: string;
}

@Component({
  selector: 'app-dog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './dog-detail.html',
  styleUrl: './dog-detail.css',
})
export class DogDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  private apiUrl = 'http://localhost:8080/api';

  // Icons
  readonly ArrowLeft = ArrowLeft;
  readonly Heart = Heart;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly User = User;
  readonly Home = Home;
  readonly Briefcase = Briefcase;
  readonly Users = Users;
  readonly PawPrint = PawPrint;
  readonly CheckCircle = CheckCircle;

  dog: Dog | null = null;
  isLoading = true;
  errorMessage = '';
  showAdoptionForm = false;
  isSubmitting = false;
  submissionSuccess = false;
  hasAlreadyApplied = false; // Track if user already applied

  adoptionForm!: FormGroup;

  ngOnInit() {
    const dogId = this.route.snapshot.paramMap.get('id');
    if (dogId) {
      this.loadDogDetails(+dogId);
      this.checkIfAlreadyApplied(+dogId);
    } else {
      this.router.navigate(['/dogs']);
    }

    // Load user profile and initialize form with user data
    this.loadUserProfile();
  }

  checkIfAlreadyApplied(dogId: number) {
    // Check if user has already applied for this dog
    this.http.get<any[]>(`${this.apiUrl}/adoption-requests/my-requests`).subscribe({
      next: (requests) => {
        this.hasAlreadyApplied = requests.some((req) => req.dogId === dogId);
        console.log('Has already applied for this dog:', this.hasAlreadyApplied);
      },
      error: (error) => {
        console.error('Error checking adoption status:', error);
        // If error, assume user hasn't applied
        this.hasAlreadyApplied = false;
      },
    });
  }

  loadUserProfile() {
    this.authService.refreshUserProfile().subscribe({
      next: () => {
        // Initialize form after profile is loaded
        this.initializeForm();
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        // Initialize form with whatever data is available
        this.initializeForm();
      },
    });
  }

  initializeForm() {
    this.adoptionForm = this.fb.group({
      fullName: [this.authService.getFullName(), [Validators.required]],
      email: [this.authService.getEmail(), [Validators.required, Validators.email]],
      phone: [
        this.authService.getPhoneNumber(),
        [Validators.required, Validators.pattern(/^\+?[\d\s\-()]+$/)],
      ],
      address: [this.authService.getAddress(), [Validators.required, Validators.minLength(10)]],
      occupation: ['', [Validators.required]],
      householdMembers: [1, [Validators.required, Validators.min(1)]],
      hasOtherPets: [false],
      petExperience: ['', [Validators.required, Validators.minLength(20)]],
      reason: ['', [Validators.required, Validators.minLength(50)]],
    });
  }

  loadDogDetails(id: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Dog>(`${this.apiUrl}/dogs/${id}`).subscribe({
      next: (dog) => {
        if (!dog.available) {
          this.errorMessage = 'This dog is no longer available for adoption.';
        }
        this.dog = dog;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dog details:', error);

        if (error.status === 404) {
          this.errorMessage = 'Dog not found.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please try again later.';
        } else {
          this.errorMessage = 'Failed to load dog details. Please try again.';
        }

        this.isLoading = false;
      },
    });
  }

  toggleAdoptionForm() {
    this.showAdoptionForm = !this.showAdoptionForm;
    if (this.showAdoptionForm) {
      // Scroll to form
      setTimeout(() => {
        document.getElementById('adoption-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  submitAdoptionRequest() {
    if (this.adoptionForm.invalid || !this.dog) {
      this.adoptionForm.markAllAsTouched();
      console.log('Form validation errors:', this.adoptionForm.errors);
      Object.keys(this.adoptionForm.controls).forEach((key) => {
        const control = this.adoptionForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
      return;
    }

    this.isSubmitting = true;

    const requestData: AdoptionRequest = {
      dogId: this.dog.id,
      ...this.adoptionForm.value,
    };

    console.log('Submitting adoption request:', requestData);

    this.http.post(`${this.apiUrl}/adoption-requests`, requestData).subscribe({
      next: (response) => {
        console.log('Adoption request submitted successfully:', response);
        this.submissionSuccess = true;
        this.isSubmitting = false;
        this.adoptionForm.reset();
        this.showAdoptionForm = false;

        // Navigate to My Requests page after short delay
        setTimeout(() => {
          this.router.navigate(['/my-requests']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error submitting adoption request:', error);
        console.error('Error response:', error.error);
        this.isSubmitting = false;

        if (error.status === 400) {
          const errorMsg =
            error.error?.message || 'Invalid form data. Please check your information.';
          alert(errorMsg);
        } else if (error.status === 409) {
          alert('You have already submitted a request for this dog.');
        } else {
          alert('Failed to submit adoption request. Please try again.');
        }
      },
    });
  }

  getAgeLabel(age: number): string {
    if (age < 1) return 'Puppy (Less than 1 year)';
    if (age === 1) return '1 year old';
    return `${age} years old`;
  }

  getGenderLabel(gender: string): string {
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  }

  goBack() {
    this.router.navigate(['/dogs']);
  }
}
