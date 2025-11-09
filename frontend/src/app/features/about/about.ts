import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Heart,
  Target,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  authService = inject(AuthService);

  // Icons
  readonly Heart = Heart;
  readonly Target = Target;
  readonly Users = Users;
  readonly Award = Award;
  readonly CheckCircle = CheckCircle;
  readonly ArrowRight = ArrowRight;

  values = [
    {
      icon: this.Heart,
      title: 'Compassion First',
      description:
        'Every decision we make is guided by the well-being and happiness of the dogs in our care.',
    },
    {
      icon: this.Users,
      title: 'Community Driven',
      description:
        'We believe in building strong relationships between families and their future companions.',
    },
    {
      icon: this.Award,
      title: 'Excellence in Care',
      description:
        'All our dogs receive proper veterinary care, nutrition, and socialization before adoption.',
    },
    {
      icon: this.Target,
      title: 'Transparent Process',
      description: 'We maintain open communication throughout the entire adoption journey.',
    },
  ];

  stats = [
    { number: '500+', label: 'Dogs Rescued' },
    { number: '450+', label: 'Successful Adoptions' },
    { number: '50+', label: 'Available Dogs' },
    { number: '95%', label: 'Adoption Success Rate' },
  ];

  team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Veterinary Director',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'Adoption Coordinator',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Care Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    },
  ];
}
