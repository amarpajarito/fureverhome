import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
} from 'lucide-angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  // Icons
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly Clock = Clock;
  readonly Send = Send;
  readonly MessageCircle = MessageCircle;

  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;

  contactInfo = [
    {
      icon: this.Phone,
      title: 'Phone',
      details: '(555) 123-4567',
      subtitle: 'Mon-Fri 9AM-6PM',
    },
    {
      icon: this.Mail,
      title: 'Email',
      details: 'info@fureverhome.com',
      subtitle: 'We reply within 24 hours',
    },
    {
      icon: this.MapPin,
      title: 'Address',
      details: '123 Adoption Street',
      subtitle: 'Pet City, PC 12345',
    },
    {
      icon: this.Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9AM-6PM',
      subtitle: 'Sat-Sun: 10AM-4PM',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      // TODO: Implement actual API call
      console.log('Contact form submitted:', this.contactForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.contactForm.reset();

        // Reset success message after 5 seconds
        setTimeout(() => {
          this.isSubmitted = false;
        }, 5000);
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}
