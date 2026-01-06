import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (overlay) {
      <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div [class]="containerClasses">
          <div [class]="spinnerClasses"></div>
          @if (text) {
            <p class="mt-4 text-slate-600 dark:text-slate-300 font-medium">{{ text }}</p>
          }
        </div>
      </div>
    } @else {
      <div [class]="containerClasses">
        <div [class]="spinnerClasses"></div>
        @if (text) {
          <p class="mt-3 text-slate-500 dark:text-slate-400 text-sm">{{ text }}</p>
        }
      </div>
    }
  `,
  styles: [`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() text = '';
  @Input() overlay = false;

  get containerClasses(): string {
    return 'flex flex-col items-center justify-center';
  }

  get spinnerClasses(): string {
    const sizes: Record<SpinnerSize, string> = {
      sm: 'w-5 h-5 border-2',
      md: 'w-8 h-8 border-3',
      lg: 'w-12 h-12 border-4',
      xl: 'w-16 h-16 border-4',
    };

    return `
      ${sizes[this.size]}
      rounded-full
      border-primary-200 dark:border-slate-600
      border-t-primary-500
      animate-spin
    `;
  }
}
