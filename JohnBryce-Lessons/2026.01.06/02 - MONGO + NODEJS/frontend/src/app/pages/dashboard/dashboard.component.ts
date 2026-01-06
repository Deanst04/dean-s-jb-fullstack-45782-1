import { Component, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    LoadingSpinnerComponent,
    SafeHtmlPipe,
  ],
  template: `
    <div class="space-y-8 animate-fade-in">
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 dark:text-white">
            Welcome back, {{ auth.userName() }}!
          </h1>
          <p class="text-slate-600 dark:text-slate-400 mt-1">
            Here's what's happening with your products today.
          </p>
        </div>

        <a routerLink="/app/products">
          <app-button variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            View Products
          </app-button>
        </a>
      </div>

      <!-- Stats Grid with fixed heights to prevent CLS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats(); track stat.title; let i = $index) {
          <div class="animate-fade-in-up" [style.animation-delay]="(i * 100) + 'ms'">
            <app-card [hover]="true" padding="md">
              <div class="flex items-start justify-between min-h-[100px]">
                <div class="flex-1">
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-1 min-h-[20px]">
                    {{ stat.title }}
                  </p>
                  <p class="text-3xl font-bold text-slate-800 dark:text-white min-h-[36px]">
                    {{ stat.value }}
                  </p>
                  <p [class]="getChangeClass(stat.changeType)" class="min-h-[20px]">
                    {{ stat.change }}
                  </p>
                </div>
                <div class="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center
                            shadow-glow-primary flex-shrink-0 aspect-square">
                  <span [innerHTML]="stat.icon | safeHtml" class="w-6 h-6 text-white"></span>
                </div>
              </div>
            </app-card>
          </div>
        }
      </div>

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Recent Products -->
        <div class="lg:col-span-2">
          <app-card title="Recent Products" subtitle="Your latest inventory additions" padding="md">
            @if (productService.loading()) {
              <div class="py-8">
                <app-loading-spinner text="Loading products..." />
              </div>
            } @else if (recentProducts().length === 0) {
              <div class="py-8 text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg opacity-20
                            flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p class="text-slate-500 dark:text-slate-400 mb-4">
                  No products yet. Create your first product!
                </p>
                <a routerLink="/app/products">
                  <app-button variant="primary" size="sm">
                    Add Product
                  </app-button>
                </a>
              </div>
            } @else {
              <div class="divide-y divide-white/10">
                @for (product of recentProducts(); track product.id) {
                  <a
                    [routerLink]="['/app/products', product.id]"
                    class="flex items-center gap-4 py-4 hover:bg-white/5 -mx-4 px-4
                           rounded-xl transition-colors"
                  >
                    <div class="w-12 h-12 rounded-xl gradient-bg opacity-80
                                flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-slate-800 dark:text-white truncate">
                        {{ product.name }}
                      </p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">
                        {{ product.stock }} in stock
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold gradient-text">
                        {{ product.price | currency }}
                      </p>
                    </div>
                  </a>
                }
              </div>
              <div class="mt-4 pt-4 border-t border-white/10 text-center">
                <a
                  routerLink="/app/products"
                  class="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                >
                  View all products
                </a>
              </div>
            }
          </app-card>
        </div>

        <!-- Quick Actions -->
        <div>
          <app-card title="Quick Actions" padding="md">
            <div class="space-y-3">
              @for (action of quickActions; track action.label) {
                <a
                  [routerLink]="action.route"
                  class="flex items-center gap-3 p-3 rounded-xl min-h-[56px]
                         bg-white/5 hover:bg-white/10 border border-white/10
                         hover:border-primary-400/30 transition-all duration-200 group
                         touch-manipulation active:scale-[0.98]"
                >
                  <div [class]="action.iconBg"
                       class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 aspect-square">
                    <span [innerHTML]="action.icon | safeHtml" class="w-5 h-5"></span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-slate-800 dark:text-white group-hover:text-primary-400
                              transition-colors truncate">
                      {{ action.label }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {{ action.description }}
                    </p>
                  </div>
                  <svg class="w-4 h-4 text-slate-400 group-hover:text-primary-400 transition-colors flex-shrink-0"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              }
            </div>
          </app-card>

          <!-- Activity Feed -->
          <app-card title="Activity" subtitle="Recent updates" padding="md" class="mt-6">
            <div class="space-y-4">
              @for (activity of activities; track activity.id) {
                <div class="flex gap-3">
                  <div [class]="activity.iconBg"
                       class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span [innerHTML]="activity.icon | safeHtml" class="w-4 h-4"></span>
                  </div>
                  <div>
                    <p class="text-sm text-slate-800 dark:text-white">
                      {{ activity.message }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      {{ activity.time }}
                    </p>
                  </div>
                </div>
              }
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly productService = inject(ProductService);

  readonly recentProducts = computed(() => {
    return this.productService.products().slice(0, 5);
  });

  readonly stats = computed((): StatCard[] => {
    const products = this.productService.products();
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    return [
      {
        title: 'Total Products',
        value: totalProducts,
        change: '+12% from last month',
        changeType: 'positive',
        icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>`,
      },
      {
        title: 'Total Stock',
        value: totalStock.toLocaleString(),
        change: '+5% from last week',
        changeType: 'positive',
        icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>`,
      },
      {
        title: 'Inventory Value',
        value: '$' + totalValue.toLocaleString(),
        change: '+18% growth',
        changeType: 'positive',
        icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>`,
      },
      {
        title: 'Low Stock Items',
        value: lowStock,
        change: lowStock > 0 ? 'Needs attention' : 'All good',
        changeType: lowStock > 0 ? 'negative' : 'positive',
        icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>`,
      },
    ];
  });

  readonly quickActions = [
    {
      label: 'Add Product',
      description: 'Create a new product',
      route: '/app/products',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-primary-400">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>`,
      iconBg: 'bg-primary-500/20',
    },
    {
      label: 'View Inventory',
      description: 'Browse all products',
      route: '/app/products',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-accent-400">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>`,
      iconBg: 'bg-accent-500/20',
    },
    {
      label: 'Generate Report',
      description: 'Export inventory data',
      route: '/app/dashboard',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-green-400">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>`,
      iconBg: 'bg-green-500/20',
    },
  ];

  readonly activities = [
    {
      id: 1,
      message: 'New product added',
      time: '2 minutes ago',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-green-400">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>`,
      iconBg: 'bg-green-500/20',
    },
    {
      id: 2,
      message: 'Stock updated for 3 items',
      time: '15 minutes ago',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-primary-400">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>`,
      iconBg: 'bg-primary-500/20',
    },
    {
      id: 3,
      message: 'Low stock alert: Widget Pro',
      time: '1 hour ago',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-yellow-400">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>`,
      iconBg: 'bg-yellow-500/20',
    },
    {
      id: 4,
      message: 'Inventory report generated',
      time: '3 hours ago',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-accent-400">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>`,
      iconBg: 'bg-accent-500/20',
    },
  ];

  ngOnInit(): void {
    this.productService.getAll();
  }

  getChangeClass(type: 'positive' | 'negative' | 'neutral'): string {
    const base = 'text-sm mt-1';
    switch (type) {
      case 'positive':
        return `${base} text-green-400`;
      case 'negative':
        return `${base} text-red-400`;
      default:
        return `${base} text-slate-500`;
    }
  }
}
