import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Back Button -->
      <a
        routerLink="/app/products"
        class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400
               hover:text-primary-400 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </a>

      <!-- Loading State -->
      @if (productService.loading()) {
        <div class="py-20">
          <app-loading-spinner size="lg" text="Loading product..." />
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
              Product not found
            </h3>
            <p class="text-slate-500 dark:text-slate-400 mb-4">
              {{ productService.error() }}
            </p>
            <a routerLink="/app/products">
              <app-button variant="primary">
                Back to Products
              </app-button>
            </a>
          </div>
        </app-card>
      }

      <!-- Product Detail -->
      @else if (product) {
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Left Column - Image -->
          <app-card padding="none">
            <div class="aspect-square rounded-2xl gradient-bg opacity-80
                        flex items-center justify-center">
              <svg class="w-32 h-32 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </app-card>

          <!-- Right Column - Details -->
          <div class="space-y-6">
            <!-- Title & Stock -->
            <div>
              <div class="flex items-start justify-between gap-4 mb-4">
                <h1 class="text-3xl font-bold text-slate-800 dark:text-white">
                  {{ product.name }}
                </h1>
                <span [class]="stockBadgeClasses">
                  @if (product.stock > 0) {
                    <span class="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    In Stock
                  } @else {
                    <span class="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Out of Stock
                  }
                </span>
              </div>
              <p class="text-4xl font-bold gradient-text">
                {{ product.price | currency }}
              </p>
            </div>

            <!-- Info Cards -->
            <app-card padding="md">
              <div class="space-y-4">
                <!-- Stock -->
                <div class="flex items-center justify-between py-3 border-b border-white/10">
                  <span class="text-slate-600 dark:text-slate-400">Available Stock</span>
                  <span
                    [class]="product.stock > 0
                      ? 'font-semibold text-green-400'
                      : 'font-semibold text-red-400'"
                  >
                    {{ product.stock }} units
                  </span>
                </div>

                <!-- Stock Status -->
                <div class="flex items-center justify-between py-3 border-b border-white/10">
                  <span class="text-slate-600 dark:text-slate-400">Status</span>
                  <span [class]="product.stock > 10
                    ? 'text-green-400'
                    : product.stock > 0
                      ? 'text-yellow-400'
                      : 'text-red-400'">
                    @if (product.stock > 10) {
                      Well Stocked
                    } @else if (product.stock > 0) {
                      Low Stock
                    } @else {
                      Needs Restock
                    }
                  </span>
                </div>

                <!-- Product ID -->
                <div class="flex items-center justify-between py-3 border-b border-white/10">
                  <span class="text-slate-600 dark:text-slate-400">Product ID</span>
                  <span class="font-mono text-sm text-slate-800 dark:text-white">
                    {{ product.id }}
                  </span>
                </div>

                <!-- Created -->
                <div class="flex items-center justify-between py-3 border-b border-white/10">
                  <span class="text-slate-600 dark:text-slate-400">Created</span>
                  <span class="text-slate-800 dark:text-white">
                    {{ formatDate(product.created_at) }}
                  </span>
                </div>

                <!-- Updated -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-slate-600 dark:text-slate-400">Last Updated</span>
                  <span class="text-slate-800 dark:text-white">
                    {{ formatDate(product.updated_at) }}
                  </span>
                </div>
              </div>
            </app-card>

            <!-- Actions -->
            <div class="flex gap-4">
              <app-button variant="primary" [fullWidth]="true">
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Product
              </app-button>
              <app-button variant="danger">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </app-button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly productService = inject(ProductService);

  get product() {
    return this.productService.selectedProduct();
  }

  get stockBadgeClasses(): string {
    const base = 'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium';

    if (this.product && this.product.stock > 0) {
      return `${base} bg-green-500/10 text-green-400 border border-green-400/20`;
    }
    return `${base} bg-red-500/10 text-red-400 border border-red-400/20`;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.router.navigate(['/app/products']);
    }
  }

  async loadProduct(id: string): Promise<void> {
    const product = await this.productService.getById(id);
    if (!product) {
      // Product not found, error is already set by service
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
