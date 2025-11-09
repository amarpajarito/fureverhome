import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Heart,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  PawPrint,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  authService = inject(AuthService);

  // Icons
  readonly Heart = Heart;
  readonly Shield = Shield;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly ArrowRight = ArrowRight;
  readonly PawPrint = PawPrint;

  features = [
    {
      icon: this.Heart,
      title: 'Find Your Perfect Match',
      description:
        'Browse through our loving dogs waiting for their forever home. Each profile includes detailed information about personality, health, and care needs.',
    },
    {
      icon: this.Shield,
      title: 'Safe & Secure Process',
      description:
        'Our verified adoption process ensures the safety and well-being of both dogs and adopters. All health records are thoroughly documented.',
    },
    {
      icon: this.Clock,
      title: 'Track Your Application',
      description:
        'Stay updated on your adoption request status in real-time. Receive notifications and communicate directly with our team.',
    },
  ];

  // Featured dogs - TODO: Replace with actual API data
  featuredDogs = [
    {
      id: 1,
      name: 'Max',
      breed: 'Golden Retriever',
      age: '2 years',
      gender: 'Male',
      imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop',
      description: 'Friendly and energetic, loves to play fetch!',
    },
    {
      id: 2,
      name: 'Bella',
      breed: 'Labrador',
      age: '3 years',
      gender: 'Female',
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
      description: 'Gentle and loving, great with kids.',
    },
    {
      id: 3,
      name: 'Charlie',
      breed: 'Beagle',
      age: '1 year',
      gender: 'Male',
      imageUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=300&fit=crop',
      description: 'Playful and curious, perfect companion.',
    },
  ];

  stats = [
    { value: '500+', label: 'Dogs Adopted' },
    { value: '200+', label: 'Happy Families' },
    { value: '50+', label: 'Available Dogs' },
    { value: '99%', label: 'Success Rate' },
  ];
}
