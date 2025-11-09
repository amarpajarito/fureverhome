import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './shared/component/navbar/navbar';
import { Footer } from './shared/component/footer/footer';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  showLayout = signal(true);

  constructor(private router: Router) {
    // Hide navbar/footer on auth pages
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEvent = event as NavigationEnd;
        const authRoutes = ['/login', '/register'];
        this.showLayout.set(!authRoutes.includes(navigationEvent.urlAfterRedirects));
      });
  }
}
