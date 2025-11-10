import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  PawPrint,
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

interface DashboardStats {
  totalDogs: number;
  availableDogs: number;
  adoptedDogs: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  authService = inject(AuthService);

  // Expose icons to template
  readonly PawPrint = PawPrint;
  readonly Users = Users;
  readonly FileText = FileText;
  readonly TrendingUp = TrendingUp;
  readonly ArrowRight = ArrowRight;

  stats: DashboardStats = {
    totalDogs: 0,
    availableDogs: 0,
    adoptedDogs: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  };

  isLoading = true;
  errorMessage = '';

  private apiUrl = 'http://localhost:8080/api';

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.isLoading = true;
    this.errorMessage = '';

    // Load all stats in parallel
    Promise.all([
      this.http.get<any[]>(`${this.apiUrl}/dogs`).toPromise(),
      this.http.get<any[]>(`${this.apiUrl}/adoption-requests`).toPromise(),
    ])
      .then(([dogs, requests]) => {
        console.log('Dashboard data loaded:', { dogs, requests });

        // Calculate dog stats
        this.stats.totalDogs = dogs?.length || 0;
        this.stats.availableDogs = dogs?.filter((d) => d.available).length || 0;
        this.stats.adoptedDogs = dogs?.filter((d) => !d.available).length || 0;

        // Calculate request stats
        this.stats.pendingRequests = requests?.filter((r) => r.status === 'PENDING').length || 0;
        this.stats.approvedRequests = requests?.filter((r) => r.status === 'APPROVED').length || 0;
        this.stats.rejectedRequests = requests?.filter((r) => r.status === 'REJECTED').length || 0;

        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading dashboard stats:', error);
        this.isLoading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'You do not have permission to access this page.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please try again later.';
        } else {
          this.errorMessage = 'Failed to load dashboard data. Please try again.';
        }
      });
  }
}
