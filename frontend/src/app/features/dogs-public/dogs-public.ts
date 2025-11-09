import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Lock,
  UserPlus,
  LogIn,
  Heart,
  Shield,
  CheckCircle,
} from 'lucide-angular';

@Component({
  selector: 'app-dogs-public',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './dogs-public.html',
  styleUrl: './dogs-public.css',
})
export class DogsPublic {
  // Icons
  readonly Lock = Lock;
  readonly UserPlus = UserPlus;
  readonly LogIn = LogIn;
  readonly Heart = Heart;
  readonly Shield = Shield;
  readonly CheckCircle = CheckCircle;

  // Preview dogs - blurred for non-authenticated users
  previewDogs = [
    {
      name: 'Max',
      breed: 'Golden Retriever',
      age: '2 years',
      imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop',
    },
    {
      name: 'Bella',
      breed: 'Labrador',
      age: '3 years',
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    },
    {
      name: 'Charlie',
      breed: 'Beagle',
      age: '1 year',
      imageUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=300&fit=crop',
    },
    {
      name: 'Luna',
      breed: 'Husky',
      age: '4 years',
      imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=300&fit=crop',
    },
    {
      name: 'Rocky',
      breed: 'German Shepherd',
      age: '2 years',
      imageUrl: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400&h=300&fit=crop',
    },
    {
      name: 'Daisy',
      breed: 'Poodle',
      age: '3 years',
      imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=300&fit=crop',
    },
  ];

  benefits = [
    {
      icon: this.Heart,
      title: 'Full Dog Profiles',
      description:
        'Access detailed information about each dog including personality, health history, and care needs.',
    },
    {
      icon: this.CheckCircle,
      title: 'Submit Adoption Requests',
      description:
        'Apply to adopt your favorite dogs and track your application status in real-time.',
    },
    {
      icon: this.Shield,
      title: 'Safe & Secure',
      description:
        'Your personal information is protected with industry-standard security measures.',
    },
  ];
}
