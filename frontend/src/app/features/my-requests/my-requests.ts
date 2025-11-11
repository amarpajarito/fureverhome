import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  FileText,
  Calendar,
  Dog,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

interface AdoptionRequest {
  id: number;
  dogId: number;
  dogName: string;
  dogBreed: string;
  dogImageUrl: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  householdMembers: number;
  hasOtherPets: boolean;
  petExperience: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './my-requests.html',
  styleUrl: './my-requests.css',
})
export class MyRequests implements OnInit {
  private http = inject(HttpClient);
  authService = inject(AuthService);

  // Icons
  readonly FileText = FileText;
  readonly Calendar = Calendar;
  readonly Dog = Dog;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly XCircle = XCircle;
  readonly Eye = Eye;

  requests: AdoptionRequest[] = [];
  isLoading = true;
  errorMessage = '';

  private apiUrl = 'http://localhost:8080/api';

  ngOnInit() {
    this.loadMyRequests();
  }

  loadMyRequests() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<AdoptionRequest[]>(`${this.apiUrl}/adoption-requests/my-requests`).subscribe({
      next: (requests) => {
        console.log('Adoption requests loaded:', requests);
        this.requests = requests.map((request) => ({
          ...request,
          dogImageUrl: this.getImageUrl(request),
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading adoption requests:', error);
        this.isLoading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Please log in to view your requests.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please try again later.';
        } else {
          this.errorMessage = 'Failed to load your requests. Please try again.';
        }
      },
    });
  }

  getImageUrl(request: AdoptionRequest): string {
    // If dogImageUrl is provided from backend
    if (request.dogImageUrl) {
      // If it starts with /api, prepend the base URL
      if (request.dogImageUrl.startsWith('/api')) {
        return `http://localhost:8080${request.dogImageUrl}`;
      }
      // If it's already a full URL, use it as is
      if (request.dogImageUrl.startsWith('http')) {
        return request.dogImageUrl;
      }
      // Otherwise, construct the full URL
      return `http://localhost:8080${request.dogImageUrl}`;
    }

    // Fallback: Return placeholder
    return '';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatusIcon(status: string) {
    switch (status) {
      case 'PENDING':
        return this.Clock;
      case 'APPROVED':
        return this.CheckCircle;
      case 'REJECTED':
        return this.XCircle;
      default:
        return this.AlertCircle;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
