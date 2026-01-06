import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)"
    >
      @if (loading) {
        <svg
          class="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const base = `
      inline-flex items-center justify-center font-medium
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      rounded-xl backdrop-blur-md border
      touch-manipulation active:scale-95
    `;

    const variants: Record<ButtonVariant, string> = {
      primary: `
        bg-gradient-to-r from-primary-500 to-primary-600
        hover:from-primary-600 hover:to-primary-700
        text-white border-primary-400/30
        focus:ring-primary-500 shadow-glow-primary
        hover:shadow-lg hover:scale-[1.02]
      `,
      secondary: `
        bg-white/10 border-white/20
        hover:bg-white/20 text-white
        dark:text-white text-slate-800
        focus:ring-white/50
        hover:shadow-glass-sm
      `,
      ghost: `
        bg-transparent border-transparent
        hover:bg-white/10 text-slate-600
        dark:text-slate-300 dark:hover:text-white
        focus:ring-slate-500
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-red-600
        hover:from-red-600 hover:to-red-700
        text-white border-red-400/30
        focus:ring-red-500
        hover:shadow-lg
      `,
    };

    // Updated sizes with minimum touch targets (44px)
    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm min-h-[44px]',
      md: 'px-5 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[48px]',
    };

    const width = this.fullWidth ? 'w-full' : '';

    return `${base} ${variants[this.variant]} ${sizes[this.size]} ${width}`.trim();
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
