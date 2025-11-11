import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Eye, Check, X, Clock, Search, AlertCircle } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

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
  userId: number;
}

@Component({
  selector: 'app-admin-adoptions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-adoptions.html',
  styleUrl: './admin-adoptions.css',
})
export class AdminAdoptions implements OnInit {
  private http = inject(HttpClient);

  // Icons
  readonly Eye = Eye;
  readonly Check = Check;
  readonly X = X;
  readonly Clock = Clock;
  readonly Search = Search;
  readonly AlertCircle = AlertCircle;

  requests: AdoptionRequest[] = [];
  filteredRequests: AdoptionRequest[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  statusFilter = '';

  selectedRequest: AdoptionRequest | null = null;
  showDetailsModal = false;

  private apiUrl = 'http://localhost:8080/api/adoption-requests';

  ngOnInit() {
    this.loadAdoptionRequests();
  }

  loadAdoptionRequests() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<AdoptionRequest[]>(this.apiUrl).subscribe({
      next: (requests) => {
        console.log('Adoption requests loaded:', requests);
        // Process image URLs for each request
        this.requests = requests.map((request) => ({
          ...request,
          dogImageUrl: this.getImageUrl(request),
        }));
        this.filteredRequests = this.requests;
        this.isLoading = false;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading adoption requests:', error);
        this.isLoading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'You do not have permission to access this page.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please try again later.';
        } else {
          this.errorMessage = 'Failed to load adoption requests. Please try again.';
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

  applyFilters() {
    this.filteredRequests = this.requests.filter((request) => {
      const matchesSearch =
        !this.searchTerm ||
        request.dogName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || request.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  viewDetails(request: AdoptionRequest) {
    this.selectedRequest = request;
    this.showDetailsModal = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedRequest = null;
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'auto';
  }

  updateStatus(requestId: number, status: 'APPROVED' | 'REJECTED') {
    const confirmMessage =
      status === 'APPROVED'
        ? 'Are you sure you want to approve this adoption request?'
        : 'Are you sure you want to reject this adoption request?';

    if (!confirm(confirmMessage)) {
      return;
    }

    this.http.patch(`${this.apiUrl}/${requestId}/status`, { status }).subscribe({
      next: () => {
        console.log('Status updated successfully');
        this.successMessage = `Adoption request ${status.toLowerCase()} successfully.`;
        this.loadAdoptionRequests();
        this.closeDetailsModal();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
