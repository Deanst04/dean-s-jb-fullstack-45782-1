import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price' | 'stock' | 'updated';

@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ScrollingModule,
    ProductCardComponent,
    InputComponent,
    ButtonComponent,
    CardComponent,
  ],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 dark:text-white">Products</h1>
          <p class="text-slate-600 dark:text-slate-400 mt-1">
            Manage your product inventory
          </p>
        </div>

        <app-button variant="primary" (buttonClick)="openCreateModal()">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </app-button>
      </div>

      <!-- Filters Bar -->
      <app-card padding="md">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <app-input
              type="search"
              placeholder="Search products by name..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
            />
          </div>

          <!-- View Toggle -->
          <div class="flex items-center gap-2">
            <button
              (click)="setViewMode('grid')"
              [class]="viewModeButtonClass('grid')"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              (click)="setViewMode('list')"
              [class]="viewModeButtonClass('list')"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <!-- Sort -->
          <select
            [(ngModel)]="sortBy"
            (ngModelChange)="onSortChange($event)"
            class="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                   text-slate-800 dark:text-white backdrop-blur-md
                   focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="updated">Sort by Updated</option>
          </select>
        </div>
      </app-card>

      <!-- Results Info -->
      <div class="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>
          Showing {{ filteredProducts().length }} of {{ productService.products().length }} products
        </span>
        @if (searchQuery) {
          <button
            (click)="clearSearch()"
            class="text-primary-400 hover:text-primary-300 transition-colors"
          >
            Clear search
          </button>
        }
      </div>

      <!-- Loading State with Skeleton -->
      @if (productService.loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (skeleton of skeletonArray; track $index) {
            <div class="glass-card p-6 animate-pulse">
              <div class="w-full h-40 rounded-xl mb-4 bg-slate-300/20"></div>
              <div class="space-y-3">
                <div class="h-6 bg-slate-300/20 rounded w-3/4"></div>
                <div class="flex items-center justify-between">
                  <div class="h-8 bg-slate-300/20 rounded w-24"></div>
                  <div class="h-6 bg-slate-300/20 rounded w-20"></div>
                </div>
                <div class="pt-3 border-t border-white/10 flex justify-between">
                  <div class="h-4 bg-slate-300/20 rounded w-20"></div>
                  <div class="h-4 bg-slate-300/20 rounded w-4"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Error State -->
      @else if (productService.error()) {
        <app-card padding="lg">
          <div class="text-center py-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10
                        flex items-center justify-center">
              <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Failed to load products
            </h3>
            <p class="text-slate-500 dark:text-slate-400 mb-4">
              {{ productService.error() }}
            </p>
            <app-button variant="primary" (buttonClick)="loadProducts()">
              Try Again
            </app-button>
          </div>
        </app-card>
      }

      <!-- Empty State -->
      @else if (filteredProducts().length === 0) {
        <app-card padding="lg">
          <div class="text-center py-12">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full gradient-bg opacity-20
                        flex items-center justify-center">
              <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            @if (searchQuery) {
              <h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                No products found
              </h3>
              <p class="text-slate-500 dark:text-slate-400 mb-6">
                No products match "{{ searchQuery }}". Try a different search.
              </p>
              <app-button variant="secondary" (buttonClick)="clearSearch()">
                Clear Search
              </app-button>
            } @else {
              <h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                No products yet
              </h3>
              <p class="text-slate-500 dark:text-slate-400 mb-6">
                Get started by creating your first product.
              </p>
              <app-button variant="primary" (buttonClick)="openCreateModal()">
                Create Product
              </app-button>
            }
          </div>
        </app-card>
      }

      <!-- Products Grid/List with Virtual Scrolling -->
      @else {
        @if (viewMode() === 'grid') {
          <cdk-virtual-scroll-viewport
            itemSize="320"
            class="h-[calc(100vh-280px)] w-full scrollbar-thin"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
              @for (product of filteredProducts(); track trackByProductId($index, product); let i = $index) {
                <div class="animate-fade-in-up" [style.animation-delay]="(Math.min(i, 8) * 50) + 'ms'">
                  <app-product-card [product]="product" />
                </div>
              }
            </div>
          </cdk-virtual-scroll-viewport>
        } @else {
          <cdk-virtual-scroll-viewport
            itemSize="88"
            class="h-[calc(100vh-280px)] w-full scrollbar-thin"
          >
            <div class="space-y-4">
              @for (product of filteredProducts(); track trackByProductId($index, product); let i = $index) {
                <div class="animate-fade-in" [style.animation-delay]="(Math.min(i, 10) * 30) + 'ms'">
                  <app-card [hover]="true">
                    <a
                      [routerLink]="['/app/products', product.id]"
                      class="flex items-center gap-6 p-2 min-h-[44px]"
                    >
                      <!-- Image with aspect ratio -->
                      <div class="w-20 h-20 rounded-xl gradient-bg opacity-80 flex-shrink-0
                                  flex items-center justify-center aspect-square">
                        <svg class="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>

                      <!-- Info -->
                      <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-semibold text-slate-800 dark:text-white truncate">
                          {{ product.name }}
                        </h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                          Updated {{ formatDate(product.updated_at) }}
                        </p>
                      </div>

                      <!-- Price -->
                      <div class="text-right">
                        <div class="text-xl font-bold gradient-text">
                          {{ product.price | currency }}
                        </div>
                        <div
                          [class]="product.stock > 0
                            ? 'text-sm text-green-400'
                            : 'text-sm text-red-400'"
                        >
                          {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}
                        </div>
                      </div>

                      <!-- Arrow -->
                      <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </app-card>
                </div>
              }
            </div>
          </cdk-virtual-scroll-viewport>
        }
      }
    </div>
  `,
  styles: []
})
export class ProductListComponent implements OnInit {
  readonly productService = inject(ProductService);

  // For template usage
  readonly Math = Math;

  // Skeleton loader array
  readonly skeletonArray = Array(8).fill(0);

  searchQuery = '';
  readonly viewMode = signal<ViewMode>('grid');
  sortBy: SortOption = 'name';

  readonly filteredProducts = computed(() => {
    let products = [...this.productService.products()];

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Sort
    products.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });

    return products;
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  onSortChange(sort: SortOption): void {
    this.sortBy = sort;
  }

  viewModeButtonClass(mode: ViewMode): string {
    const base = 'p-2.5 rounded-xl transition-all duration-200';
    if (this.viewMode() === mode) {
      return `${base} bg-primary-500/20 text-primary-400 border border-primary-400/30`;
    }
    return `${base} bg-white/10 text-slate-400 border border-white/20 hover:bg-white/20`;
  }

  openCreateModal(): void {
    // TODO: Implement create modal
    console.log('Open create modal');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  // TrackBy function for optimal rendering performance
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
