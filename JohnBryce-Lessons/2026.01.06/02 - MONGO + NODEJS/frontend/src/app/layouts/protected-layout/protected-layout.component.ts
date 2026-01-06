import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-protected-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, SafeHtmlPipe],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <!-- Navbar -->
      <app-navbar />

      <div class="flex pt-24">
        <!-- Sidebar -->
        <aside
          [class]="sidebarClasses"
          [class.w-64]="!sidebarCollapsed()"
          [class.w-20]="sidebarCollapsed()"
        >
          <div class="glass h-full rounded-2xl mx-4 py-6">
            <!-- Toggle Button -->
            <button
              (click)="toggleSidebar()"
              class="w-full flex justify-center mb-6 px-4"
            >
              <div class="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <svg
                  class="w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform"
                  [class.rotate-180]="sidebarCollapsed()"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </div>
            </button>

            <!-- Navigation -->
            <nav class="space-y-2 px-3">
              @for (item of navItems; track item.route) {
                <a
                  [routerLink]="item.route"
                  routerLinkActive="bg-primary-500/20 text-primary-500 border-primary-400/30"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent
                         text-slate-600 dark:text-slate-300
                         hover:bg-white/10 hover:border-white/20
                         transition-all duration-200"
                >
                  <span [innerHTML]="item.icon | safeHtml" class="w-5 h-5 flex-shrink-0"></span>
                  @if (!sidebarCollapsed()) {
                    <span class="font-medium">{{ item.label }}</span>
                  }
                </a>
              }
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 px-4 lg:px-8 pb-8 min-h-[calc(100vh-6rem)] transition-all duration-300">
          <div class="animate-fade-in">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class ProtectedLayoutComponent {
  readonly sidebarCollapsed = signal(false);

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/app/dashboard',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>`,
    },
    {
      label: 'Products',
      route: '/app/products',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>`,
    },
  ];

  get sidebarClasses(): string {
    return 'hidden lg:block sticky top-24 h-[calc(100vh-7rem)] transition-all duration-300';
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
