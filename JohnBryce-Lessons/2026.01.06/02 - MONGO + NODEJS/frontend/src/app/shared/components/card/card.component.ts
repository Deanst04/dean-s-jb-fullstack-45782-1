import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      @if (title || subtitle) {
        <div class="mb-4">
          @if (title) {
            <h3 class="text-xl font-semibold text-slate-800 dark:text-white">
              {{ title }}
            </h3>
          }
          @if (subtitle) {
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {{ subtitle }}
            </p>
          }
        </div>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hover = false;
  @Input() glow = false;

  get cardClasses(): string {
    const base = `
      rounded-2xl
      bg-white/10 dark:bg-slate-800/50
      backdrop-blur-lg
      border border-white/20 dark:border-slate-700/30
      shadow-glass
      transition-all duration-300
    `;

    const paddings: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverEffect = this.hover
      ? 'hover:scale-[1.02] hover:shadow-xl hover:border-primary-400/30 cursor-pointer'
      : '';

    const glowEffect = this.glow ? 'animate-glow' : '';

    return `${base} ${paddings[this.padding]} ${hoverEffect} ${glowEffect}`.trim();
  }
}
