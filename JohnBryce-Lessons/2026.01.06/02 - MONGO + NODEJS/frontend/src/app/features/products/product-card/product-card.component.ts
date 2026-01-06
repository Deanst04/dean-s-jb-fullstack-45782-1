import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { HoverGlowDirective } from '../../../shared/directives/hover-glow.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, HoverGlowDirective],
  template: `
    <a
      [routerLink]="['/app/products', product.id]"
      class="block glass-card p-6 transition-all duration-300
             hover:scale-[1.02] hover:shadow-xl touch-manipulation
             active:scale-[0.98] min-h-[280px]"
      appHoverGlow
      glowColor="primary"
      glowIntensity="low"
    >
      <!-- Product Image Placeholder with fixed aspect ratio to prevent CLS -->
      <div class="w-full aspect-[4/3] rounded-xl mb-4 gradient-bg opacity-80
                  flex items-center justify-center">
        <svg class="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>

      <!-- Product Info -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white
                   line-clamp-1">
          {{ product.name }}
        </h3>

        <div class="flex items-center justify-between">
          <!-- Price -->
          <span class="text-2xl font-bold gradient-text">
            {{ product.price | currency }}
          </span>

          <!-- Stock Badge -->
          <span
            [class]="stockBadgeClasses"
          >
            @if (product.stock > 0) {
              <span class="w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
              {{ product.stock }} in stock
            } @else {
              <span class="w-2 h-2 rounded-full bg-red-400 mr-1.5"></span>
              Out of stock
            }
          </span>
        </div>

        <!-- Meta -->
        <div class="pt-3 border-t border-white/10 flex items-center justify-between
                    text-xs text-slate-500 dark:text-slate-400">
          <span>Updated {{ formatDate(product.updated_at) }}</span>
          <svg class="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  `,
  styles: []
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  get stockBadgeClasses(): string {
    const base = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium';

    if (this.product.stock > 0) {
      return `${base} bg-green-500/10 text-green-400 border border-green-400/20`;
    }
    return `${base} bg-red-500/10 text-red-400 border border-red-400/20`;
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
}
