import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Heart, Search, Filter, PawPrint } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';

export interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  description: string;
  healthStatus: string;
  imageUrl: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-dogs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './dogs.html',
  styleUrl: './dogs.css',
})
export class Dogs implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  favoritesService = inject(FavoritesService);
  private apiUrl = 'http://localhost:8080/api/dogs';

  // Icons
  readonly Heart = Heart;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly PawPrint = PawPrint;

  dogs: Dog[] = [];
  filteredDogs: Dog[] = [];
  appliedDogIds: Set<number> = new Set(); // Track dogs user already applied for
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  selectedBreed = '';
  selectedGender = '';
  selectedAge = '';
  showFavoritesOnly = false;

  // Unique breeds for filter
  breeds: string[] = [];

  ngOnInit() {
    this.loadDogs();
    this.loadFavorites();
    this.loadAppliedDogs();
  }

  loadAppliedDogs() {
    // Load dogs that user has already applied for
    this.http.get<any[]>('http://localhost:8080/api/adoption-requests/my-requests').subscribe({
      next: (requests) => {
        console.log('Applied dogs loaded:', requests);
        this.appliedDogIds = new Set(requests.map((req) => req.dogId));
        // Reapply filters to hide applied dogs
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading applied dogs:', error);
        // Don't show error to user, this is optional
      },
    });
  }

  loadFavorites() {
    // Load user's favorites
    this.favoritesService.loadFavorites().subscribe({
      next: () => {
        console.log('Favorites loaded successfully');
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        // Don't show error to user, favorites are optional
      },
    });
  }

  toggleFavorite(dogId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.favoritesService.toggleFavorite(dogId).subscribe({
      next: () => {
        console.log('Favorite toggled successfully');
        // Reapply filters to update the list if "Show Favorites Only" is active
        if (this.showFavoritesOnly) {
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        alert('Failed to update favorites. Please try again.');
      },
    });
  }

  onShowFavoritesChange() {
    // Called when checkbox changes - showFavoritesOnly is already updated by ngModel
    this.applyFilters();
  }

  isFavorite(dogId: number): boolean {
    return this.favoritesService.isFavorite(dogId);
  }

  loadDogs() {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Fetching dogs from:', `${this.apiUrl}?available=true`);

    // Get only available dogs
    this.http.get<Dog[]>(`${this.apiUrl}?available=true`).subscribe({
      next: (dogs) => {
        console.log('Dogs loaded successfully:', dogs);
        this.dogs = dogs;
        this.filteredDogs = dogs;
        this.extractBreeds();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dogs:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);

        if (error.status === 0) {
          this.errorMessage =
            'Cannot connect to server. Please make sure the backend is running on http://localhost:8080';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Authentication required. Please log in.';
        } else if (error.status === 404) {
          this.errorMessage = 'Dogs endpoint not found. Please check backend configuration.';
        } else {
          this.errorMessage = `Failed to load dogs: ${error.message || 'Unknown error'}`;
        }

        this.isLoading = false;
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

      const matchesFavorites = !this.showFavoritesOnly || this.isFavorite(dog.id);

      const notApplied = !this.appliedDogIds.has(dog.id); // Hide dogs user already applied for

      return (
        matchesSearch &&
        matchesBreed &&
        matchesGender &&
        matchesAge &&
        matchesFavorites &&
        notApplied
      );
    });
  }

  getAgeRange(age: number): string {
    if (age < 1) return 'puppy';
    if (age <= 3) return 'young';
    if (age <= 7) return 'adult';
    return 'senior';
  }

  getAgeLabel(age: number): string {
    if (age < 1) return 'Puppy';
    if (age === 1) return '1 year';
    return `${age} years`;
  }

  onSearchChange(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onBreedChange(event: Event) {
    this.selectedBreed = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onGenderChange(event: Event) {
    this.selectedGender = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onAgeChange(event: Event) {
    this.selectedAge = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedBreed = '';
    this.selectedGender = '';
    this.selectedAge = '';
    this.showFavoritesOnly = false;
    this.filteredDogs = this.dogs;
  }

  getGenderLabel(gender: string): string {
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  }
}
