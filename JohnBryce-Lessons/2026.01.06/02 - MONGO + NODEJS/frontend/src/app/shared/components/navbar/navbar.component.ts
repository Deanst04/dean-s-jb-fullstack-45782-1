import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonComponent],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="glass rounded-2xl mt-4 px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center space-x-2 group">
              <div class="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center
                          shadow-glow-primary group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span class="text-xl font-bold gradient-text">ProductHub</span>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-6">
              @if (auth.isAuthenticated()) {
                <a routerLink="/app/dashboard" routerLinkActive="text-primary-400"
                   class="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
                  Dashboard
                </a>
                <a routerLink="/app/products" routerLinkActive="text-primary-400"
                   class="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
                  Products
                </a>
              }
            </div>

            <!-- Right Side -->
            <div class="flex items-center space-x-4">
              <!-- Theme Toggle -->
              <button
                (click)="toggleTheme()"
                class="p-2 rounded-xl bg-white/10 border border-white/20
                       hover:bg-white/20 transition-all duration-300"
                [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
              >
                @if (isDark()) {
                  <svg class="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                } @else {
                  <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                }
              </button>

              <!-- Auth Buttons -->
              @if (auth.isAuthenticated()) {
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-slate-600 dark:text-slate-300">
                    {{ auth.userName() }}
                  </span>
                  <app-button variant="ghost" size="sm" (buttonClick)="logout()">
                    Logout
                  </app-button>
                </div>
              } @else {
                <a routerLink="/login">
                  <app-button variant="ghost" size="sm">Login</app-button>
                </a>
                <a routerLink="/register">
                  <app-button variant="primary" size="sm">Get Started</app-button>
                </a>
              }

              <!-- Mobile Menu Button -->
              <button
                (click)="toggleMobileMenu()"
                class="md:hidden p-2 rounded-xl bg-white/10 border border-white/20"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  @if (mobileMenuOpen()) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>

          <!-- Mobile Menu -->
          @if (mobileMenuOpen()) {
            <div class="md:hidden mt-4 pt-4 border-t border-white/10 animate-fade-in">
              @if (auth.isAuthenticated()) {
                <a routerLink="/app/dashboard"
                   class="block py-2 text-slate-600 dark:text-slate-300 hover:text-primary-500"
                   (click)="closeMobileMenu()">
                  Dashboard
                </a>
                <a routerLink="/app/products"
                   class="block py-2 text-slate-600 dark:text-slate-300 hover:text-primary-500"
                   (click)="closeMobileMenu()">
                  Products
                </a>
              }
            </div>
          }
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly isDark = signal(false);
  readonly mobileMenuOpen = signal(false);

  constructor() {
    this.initTheme();

    effect(() => {
      if (this.isDark()) {
        this.document.body.classList.add('dark');
      } else {
        this.document.body.classList.remove('dark');
      }
      localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
    });
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDark.set(savedTheme === 'dark');
    } else {
      this.isDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
