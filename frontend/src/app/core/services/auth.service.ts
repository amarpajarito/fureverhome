import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  // Signals for reactive state management
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  /**
   * Load user data from localStorage on app initialization
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        this.setAuthState(user, token);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.clearAuthState();
      }
    }
  }

  /**
   * Set authentication state
   */
  private setAuthState(user: User, token: string): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    this.isAdmin.set(user.role === 'ADMIN');
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.isAdmin.set(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  /**
   * Register a new user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => {
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role as 'USER' | 'ADMIN',
          firstName: response.firstName,
          lastName: response.lastName,
          avatarUrl: response.avatarUrl,
        };
        this.setAuthState(user, response.token);
      })
    );
  }

  /**
   * Login user
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role as 'USER' | 'ADMIN',
          firstName: response.firstName,
          lastName: response.lastName,
          avatarUrl: response.avatarUrl,
        };
        this.setAuthState(user, response.token);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/']);
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get user's full name (firstName + lastName)
   */
  getFullName(): string {
    const user = this.currentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || user?.email || '';
  }

  /**
   * Get user's email
   */
  getEmail(): string {
    return this.currentUser()?.email || '';
  }

  /**
   * Get user's initials for avatar
   */
  getInitials(): string {
    const user = this.currentUser();

    // Try to use firstName and lastName first
    if (user?.firstName && user?.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }

    // Fall back to username
    const username = user?.username || '';
    if (!username) return '?';

    const names = username.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  }

  /**
   * Update user profile data in local state
   */
  updateUserProfile(updates: Partial<User>): void {
    console.log('=== UPDATING USER PROFILE ===');
    console.log('Updates:', updates);
    console.log('Current user before update:', this.currentUser());

    const currentUserData = this.currentUser();
    if (currentUserData) {
      const updatedUser = { ...currentUserData, ...updates };
      console.log('Updated user:', updatedUser);
      console.log('New avatarUrl:', updatedUser.avatarUrl);

      this.currentUser.set(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      console.log('User profile updated in localStorage');
    } else {
      console.error('No current user data to update!');
    }
  }

  /**
   * Get user's avatar URL
   */
  getAvatarUrl(): string | null {
    return this.currentUser()?.avatarUrl || null;
  }

  /**
   * Get user's phone number
   */
  getPhoneNumber(): string {
    return this.currentUser()?.phoneNumber || '';
  }

  /**
   * Get user's address
   */
  getAddress(): string {
    return this.currentUser()?.address || '';
  }

  /**
   * Fetch and update user profile from backend
   */
  refreshUserProfile(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/users/profile').pipe(
      tap((profile) => {
        const currentUserData = this.currentUser();
        if (currentUserData) {
          const updatedUser: User = {
            ...currentUserData,
            firstName: profile.firstName,
            lastName: profile.lastName,
            avatarUrl: profile.avatarUrl,
            phoneNumber: profile.phoneNumber,
            address: profile.address,
          };
          this.currentUser.set(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      })
    );
  }
}
