import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent, SafeHtmlPipe],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div class="mx-auto max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Column - Text -->
          <div class="animate-fade-in-up">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full
                        glass-button text-sm text-primary-400 mb-6">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              New: Real-time inventory tracking
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span class="text-slate-800 dark:text-white">Manage your</span>
              <br />
              <span class="gradient-text">products</span>
              <span class="text-slate-800 dark:text-white"> with ease</span>
            </h1>

            <p class="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
              A modern product management platform built with Angular.
              Track inventory, manage stock, and scale your business with
              our powerful tools.
            </p>

            <div class="flex flex-wrap gap-4">
              <a routerLink="/register">
                <app-button variant="primary" size="lg">
                  Get Started Free
                  <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </app-button>
              </a>
              <a routerLink="/login">
                <app-button variant="secondary" size="lg">
                  Sign In
                </app-button>
              </a>
            </div>

            <!-- Stats -->
            <div class="flex gap-8 mt-12">
              @for (stat of stats; track stat.label) {
                <div class="animate-fade-in" [style.animation-delay]="stat.delay">
                  <div class="text-3xl font-bold gradient-text">{{ stat.value }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ stat.label }}</div>
                </div>
              }
            </div>
          </div>

          <!-- Right Column - Visual -->
          <div class="relative animate-slide-in-right hidden lg:block">
            <!-- Floating Cards -->
            <div class="relative h-[500px]">
              <!-- Main Card -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                          w-80 glass-card p-6 animate-float">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-slate-800 dark:text-white">ProductHub</div>
                    <div class="text-sm text-slate-500">Dashboard</div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="h-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full w-4/5"></div>
                  <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-3/5"></div>
                  <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-4/5"></div>
                </div>
              </div>

              <!-- Top Right Card -->
              <div class="absolute top-10 right-10 glass-card p-4 animate-float animate-delay-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-slate-800 dark:text-white">Stock Updated</div>
                    <div class="text-xs text-slate-500">+50 items added</div>
                  </div>
                </div>
              </div>

              <!-- Bottom Left Card -->
              <div class="absolute bottom-10 left-10 glass-card p-4 animate-float animate-delay-500">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-slate-800 dark:text-white">Sales Up</div>
                    <div class="text-xs text-green-400">+23% this week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-16 animate-fade-in">
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Everything you need to
            <span class="gradient-text">succeed</span>
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful features to help you manage inventory, track products, and grow your business.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (feature of features; track feature.title; let i = $index) {
            <div class="animate-fade-in-up" [style.animation-delay]="(i * 100) + 'ms'">
              <app-card [hover]="true" padding="lg">
                <div class="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-6
                            shadow-glow-primary">
                  <span [innerHTML]="feature.icon | safeHtml" class="w-7 h-7 text-white"></span>
                </div>
                <h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  {{ feature.title }}
                </h3>
                <p class="text-slate-600 dark:text-slate-400">
                  {{ feature.description }}
                </p>
              </app-card>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl">
        <div class="glass-card p-12 text-center relative overflow-hidden">
          <!-- Background Decoration -->
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl"></div>

          <div class="relative">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Ready to get started?
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of businesses already using ProductHub to manage their inventory efficiently.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <a routerLink="/register">
                <app-button variant="primary" size="lg">
                  Start Free Trial
                </app-button>
              </a>
              <app-button variant="secondary" size="lg">
                Contact Sales
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class LandingComponent {
  readonly stats = [
    { value: '10K+', label: 'Active Users', delay: '0ms' },
    { value: '500K+', label: 'Products Managed', delay: '100ms' },
    { value: '99.9%', label: 'Uptime', delay: '200ms' },
  ];

  readonly features: Feature[] = [
    {
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>`,
      title: 'Inventory Tracking',
      description: 'Real-time inventory management with automatic stock alerts and reorder notifications.',
    },
    {
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>`,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights with beautiful charts showing sales trends and product performance.',
    },
    {
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>`,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data storage and regular automated backups.',
    },
    {
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>`,
      title: 'Lightning Fast',
      description: 'Optimized performance with instant search and real-time updates across all devices.',
    },
    {
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>`,
      title: 'Team Collaboration',
      description: 'Work together with role-based access control and activity tracking for your team.',
    },
    {
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>`,
      title: 'API Integration',
      description: 'Connect with your existing tools using our powerful REST API and webhooks.',
    },
  ];
}
