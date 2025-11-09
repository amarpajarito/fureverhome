import { Component, inject, computed } from '@angular/core';
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
export class Navbar {
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
  userAvatarUrl = computed(() => this.authService.getAvatarUrl());

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

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
    this.closeMobileMenu();
  }
}
