import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Save, Upload, X } from 'lucide-angular';

@Component({
  selector: 'app-admin-dog-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './admin-dog-form.html',
  styleUrl: './admin-dog-form.css',
})
export class AdminDogForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  // Icons
  readonly ArrowLeft = ArrowLeft;
  readonly Save = Save;
  readonly Upload = Upload;
  readonly X = X;

  dogForm!: FormGroup;
  isEditMode = false;
  dogId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  existingDog: any = null; // Store the existing dog data
  hasExistingImage = false; // Track if dog has an existing image

  private apiUrl = 'http://localhost:8080/api/dogs';

  ngOnInit() {
    this.initializeForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.dogId = +id;
      this.loadDogData(this.dogId);
    }
  }

  initializeForm() {
    this.dogForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      breed: ['', [Validators.required, Validators.minLength(2)]],
      age: [1, [Validators.required, Validators.min(0), Validators.max(30)]],
      gender: ['MALE', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      healthStatus: ['Healthy', [Validators.required]],
      imageUrl: [''],
      available: [true],
    });
  }

  loadDogData(id: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
      next: (dog) => {
        console.log('Dog data loaded:', dog);
        this.existingDog = dog; // Store the dog data

        this.dogForm.patchValue({
          name: dog.name,
          breed: dog.breed,
          age: dog.age,
          gender: dog.gender,
          description: dog.description,
          healthStatus: dog.healthStatus,
          imageUrl: dog.imageUrl,
          available: dog.available,
        });

        // Set image preview based on what the dog has
        this.imagePreview = this.getDogImageUrl(dog);
        this.hasExistingImage = !!(dog.hasImage || dog.imageUrl);

        console.log('Image preview set to:', this.imagePreview);
        console.log('Has existing image:', this.hasExistingImage);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dog data:', error);
        this.isLoading = false;

        if (error.status === 404) {
          this.errorMessage = 'Dog not found.';
        } else {
          this.errorMessage = 'Failed to load dog data. Please try again.';
        }
      },
    });
  }

  getDogImageUrl(dog: any): string | null {
    if (!dog) return null;

    // Priority 1: If dog has binary image in database
    if (dog.hasImage) {
      return `http://localhost:8080/api/dogs/${dog.id}/image`;
    }

    // Priority 2: If imageUrl is provided
    if (dog.imageUrl) {
      // If imageUrl starts with http/https, use it directly
      if (dog.imageUrl.startsWith('http')) {
        return dog.imageUrl;
      }

      // If imageUrl starts with /api, strip it
      const cleanedUrl = dog.imageUrl.startsWith('/api') ? dog.imageUrl.substring(4) : dog.imageUrl;

      // Construct full URL
      return `http://localhost:8080${cleanedUrl}`;
    }

    return null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.hasExistingImage = false; // Mark that image should be removed
    this.dogForm.patchValue({ imageUrl: '' });
  }

  submitForm() {
    if (this.dogForm.invalid) {
      this.dogForm.markAllAsTouched();
      console.log('Form validation errors:', this.dogForm.errors);
      Object.keys(this.dogForm.controls).forEach((key) => {
        const control = this.dogForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Create FormData with all dog fields
    const formData = new FormData();
    formData.append('name', this.dogForm.value.name);
    formData.append('breed', this.dogForm.value.breed);
    formData.append('age', this.dogForm.value.age.toString());
    formData.append('gender', this.dogForm.value.gender);
    formData.append('description', this.dogForm.value.description || '');
    formData.append('healthStatus', this.dogForm.value.healthStatus);
    formData.append('available', this.dogForm.value.available.toString());

    // Add image file if selected (takes priority over imageUrl)
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
      console.log('Image file added to FormData:', this.selectedFile.name);
    } else if (this.dogForm.value.imageUrl) {
      // If no file but imageUrl provided, add it
      formData.append('imageUrl', this.dogForm.value.imageUrl);
      console.log('Image URL added to FormData:', this.dogForm.value.imageUrl);
    } else if (this.isEditMode && this.hasExistingImage && !this.selectedFile) {
      // In edit mode, if there's an existing image and no new file selected, keep the existing image
      // Backend should preserve the existing image if no new image is provided
      console.log('No new image provided, backend will keep existing image');
    }

    console.log('Submitting dog data as FormData');
    console.log('Edit mode:', this.isEditMode);
    console.log('Has new file:', !!this.selectedFile);
    console.log('Has existing image:', this.hasExistingImage);

    if (this.isEditMode && this.dogId) {
      // Update existing dog
      this.http.put(`${this.apiUrl}/${this.dogId}`, formData).subscribe({
        next: (response) => {
          console.log('Dog updated successfully:', response);
          this.isSubmitting = false;
          // Navigate with success message
          this.router.navigate(['/admin/dogs'], {
            state: {
              successMessage: `${this.dogForm.value.name} has been updated successfully.`,
              updatedDogId: this.dogId, // Pass the updated dog ID for cache busting
            },
          });
        },
        error: (error) => {
          console.error('Error updating dog:', error);
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to update dog. Please try again.';
        },
      });
    } else {
      // Create new dog
      this.http.post(this.apiUrl, formData).subscribe({
        next: (response: any) => {
          console.log('Dog created successfully:', response);
          this.isSubmitting = false;
          // Navigate with success message
          this.router.navigate(['/admin/dogs'], {
            state: {
              successMessage: `${this.dogForm.value.name} has been added successfully.`,
            },
          });
        },
        error: (error) => {
          console.error('Error creating dog:', error);
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to create dog. Please try again.';
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/dogs']);
  }
}
