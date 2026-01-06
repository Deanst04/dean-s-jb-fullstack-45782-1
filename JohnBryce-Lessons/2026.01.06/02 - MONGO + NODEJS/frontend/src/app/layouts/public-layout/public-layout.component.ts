import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <!-- Animated Background -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
        <div class="absolute top-1/2 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float animate-delay-200"></div>
        <div class="absolute -bottom-40 right-1/3 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float animate-delay-500"></div>
      </div>

      <!-- Navbar -->
      <app-navbar />

      <!-- Main Content -->
      <main class="relative pt-24">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="relative py-12 mt-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="glass rounded-2xl p-8 text-center">
            <p class="text-slate-600 dark:text-slate-400">
              &copy; {{ currentYear }} ProductHub. Built with Angular & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class PublicLayoutComponent {
  readonly currentYear = new Date().getFullYear();
}
