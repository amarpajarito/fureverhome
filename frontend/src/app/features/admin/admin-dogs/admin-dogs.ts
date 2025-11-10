import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  AlertCircle,
  CheckCircle,
  Filter,
  X,
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Dog } from '../../dogs/dogs';

@Component({
  selector: 'app-admin-dogs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-dogs.html',
  styleUrl: './admin-dogs.css',
})
export class AdminDogs implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Icons
  readonly Plus = Plus;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly Search = Search;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly Filter = Filter;
  readonly X = X;

  dogs: Dog[] = [];
  filteredDogs: Dog[] = [];
  selectedDog: Dog | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  selectedBreed = '';
  selectedGender = '';
  selectedAge = '';
  selectedStatus = '';

  // Unique breeds for filter
  breeds: string[] = [];

  private apiUrl = 'http://localhost:8080/api/dogs';

  ngOnInit() {
    this.loadDogs();

    // Check for navigation state (success message from add/edit)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state && state['successMessage']) {
      this.successMessage = state['successMessage'];
      console.log('Success message received:', this.successMessage);

      // Clear success message after 5 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }
  }

  loadDogs() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Dog[]>(this.apiUrl).subscribe({
      next: (dogs) => {
        console.log('Dogs loaded:', dogs);
        this.dogs = dogs;
        this.filteredDogs = dogs;
        this.extractBreeds();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dogs:', error);
        this.isLoading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'You do not have permission to access this page.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please try again later.';
        } else {
          this.errorMessage = 'Failed to load dogs. Please try again.';
        }
      },
    });
  }

  extractBreeds() {
    const breedSet = new Set(this.dogs.map((dog) => dog.breed));
    this.breeds = Array.from(breedSet).sort();
  }

  applyFilters() {
    this.filteredDogs = this.dogs.filter((dog) => {
      const matchesSearch =
        !this.searchTerm ||
        dog.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dog.breed.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesBreed = !this.selectedBreed || dog.breed === this.selectedBreed;

      const matchesGender = !this.selectedGender || dog.gender === this.selectedGender;

      const matchesAge = !this.selectedAge || this.getAgeRange(dog.age) === this.selectedAge;

      const matchesStatus =
        !this.selectedStatus ||
        (this.selectedStatus === 'available' && dog.available) ||
        (this.selectedStatus === 'adopted' && !dog.available);

      return matchesSearch && matchesBreed && matchesGender && matchesAge && matchesStatus;
    });
  }

  getAgeRange(age: number): string {
    if (age < 1) return 'puppy';
    if (age <= 3) return 'young';
    if (age <= 7) return 'adult';
    return 'senior';
  }

  onSearchChange() {
    this.applyFilters();
  }

  onBreedChange() {
    this.applyFilters();
  }

  onGenderChange() {
    this.applyFilters();
  }

  onAgeChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedBreed = '';
    this.selectedGender = '';
    this.selectedAge = '';
    this.selectedStatus = '';
    this.filteredDogs = this.dogs;
  }

  deleteDog(dog: Dog) {
    const confirmDelete = confirm(
      `Are you sure you want to delete ${dog.name}? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${dog.id}`).subscribe({
      next: () => {
        console.log('Dog deleted successfully');
        this.successMessage = `${dog.name} has been deleted successfully.`;
        this.loadDogs();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting dog:', error);
        alert(`Failed to delete ${dog.name}. Please try again.`);
      },
    });
  }

  getAgeLabel(age: number): string {
    if (age < 1) return 'Puppy';
    if (age === 1) return '1 year';
    return `${age} years`;
  }

  getGenderLabel(gender: string): string {
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  }

  getDogImageUrl(dog: Dog | null): string {
    if (!dog) {
      // Return a placeholder SVG if no dog
      return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect fill=%22%232D6A4F%22 width=%22800%22 height=%22600%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2248%22 fill=%22%23ffffff%22%3ENo Image%3C/text%3E%3C/svg%3E';
    }

    // Priority 1: If dog has binary image in database, use the image endpoint
    if (dog.hasImage) {
      // Add timestamp to bust browser cache and force reload
      const timestamp = new Date().getTime();
      return `http://localhost:8080/api/dogs/${dog.id}/image?t=${timestamp}`;
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

    // Fallback: Return placeholder SVG
    return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect fill=%22%232D6A4F%22 width=%22800%22 height=%22600%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2248%22 fill=%22%23ffffff%22%3ENo Image%3C/text%3E%3C/svg%3E';
  }

  viewDog(dog: Dog) {
    this.selectedDog = dog;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedDog = null;
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'auto';
  }
}
