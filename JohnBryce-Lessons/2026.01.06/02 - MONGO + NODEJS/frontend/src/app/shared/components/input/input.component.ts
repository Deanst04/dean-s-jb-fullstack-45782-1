import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label) {
        <label
          [for]="inputId"
          class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      <div class="relative">
        @if (icon) {
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <span class="text-slate-400">{{ icon }}</span>
          </div>
        }

        <input
          [id]="inputId"
          [type]="showPassword() ? 'text' : type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [class]="inputClasses"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          (blur)="onTouched()"
        />

        @if (type === 'password') {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            (click)="togglePassword()"
          >
            @if (showPassword()) {
              <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            } @else {
              <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          </button>
        }
      </div>

      @if (error) {
        <p class="mt-1.5 text-sm text-red-500">{{ error }}</p>
      }

      @if (hint && !error) {
        <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{{ hint }}</p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'search' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() icon = '';
  @Input() required = false;
  @Input() disabled = false;

  readonly inputId = `input-${Math.random().toString(36).substring(2, 9)}`;
  readonly showPassword = signal(false);

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get inputClasses(): string {
    const base = `
      w-full rounded-xl
      bg-white/10 dark:bg-slate-800/50
      backdrop-blur-md
      border border-white/20 dark:border-slate-700/30
      px-4 py-3
      text-slate-800 dark:text-white
      placeholder-slate-400 dark:placeholder-slate-500
      transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-primary-500/50
      focus:border-primary-400
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const withIcon = this.icon ? 'pl-10' : '';
    const withError = this.error ? 'border-red-400 focus:ring-red-500/50' : '';

    return `${base} ${withIcon} ${withError}`.trim();
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
