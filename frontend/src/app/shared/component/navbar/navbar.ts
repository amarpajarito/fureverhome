import { Component, inject, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  LucideAngularModule,
  Menu,
  X,
  Home,
  Heart,
  FileText,
  LayoutDashboard,
  PawPrint,
  Users,
  LogOut,
  LogIn,
  UserPlus,
  Info,
  Mail,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Icons
  readonly Menu = Menu;
  readonly X = X;
  readonly Home = Home;
  readonly Heart = Heart;
  readonly FileText = FileText;
  readonly LayoutDashboard = LayoutDashboard;
  readonly PawPrint = PawPrint;
  readonly Users = Users;
  readonly LogOut = LogOut;
  readonly LogIn = LogIn;
  readonly UserPlus = UserPlus;
  readonly Info = Info;
  readonly Mail = Mail;

  isMobileMenuOpen = false;
  isUserMenuOpen = false;

  // Auth state from service
  isAuthenticated = this.authService.isAuthenticated;
  isAdmin = this.authService.isAdmin;
  currentUser = this.authService.currentUser;

  // Computed values for display
  userFullName = computed(() => this.authService.getFullName());
  userEmail = computed(() => this.authService.getEmail());
  userInitials = computed(() => this.authService.getInitials());
  userAvatarUrl = computed(() => {
    const avatarUrl = this.authService.getAvatarUrl();
    if (!avatarUrl) return null;

    console.log('Raw avatar URL from auth service:', avatarUrl);

    // Add cache busting timestamp to force reload when avatar updates
    const timestamp = new Date().getTime();

    // If URL already starts with http, return as-is with timestamp
    if (avatarUrl.startsWith('http')) {
      return `${avatarUrl}?t=${timestamp}`;
    }

    // Ensure the URL starts with / for proper construction
    const cleanedUrl = avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl;
    const finalUrl = `http://localhost:8080${cleanedUrl}?t=${timestamp}`;

    console.log('Final avatar URL:', finalUrl);
    return finalUrl;
  });

  constructor() {
    // Effect to log avatar URL changes
    effect(() => {
      const avatarUrl = this.userAvatarUrl();
      console.log('=== NAVBAR AVATAR DEBUG ===');
      console.log('Avatar URL:', avatarUrl);
      console.log('User:', this.currentUser());
      console.log('Is Authenticated:', this.isAuthenticated());
    });
  }

  ngOnInit() {
    console.log('Navbar initialized');
    console.log('Current user:', this.currentUser());
    console.log('Avatar URL:', this.userAvatarUrl());
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  onAvatarLoad(event: Event): void {
    console.log('✅ Avatar loaded successfully:', (event.target as HTMLImageElement).src);
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.error('❌ Avatar failed to load:', img.src);
    console.error('Error event:', event);

    // Hide the image and show fallback
    img.style.display = 'none';
    const fallback = document.getElementById('avatar-fallback');
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
    this.closeMobileMenu();
  }
}
