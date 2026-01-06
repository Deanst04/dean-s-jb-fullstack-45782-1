import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardComponent,
    InputComponent,
    ButtonComponent,
  ],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md animate-fade-in-up">
        <app-card padding="lg">
          <!-- Header with fixed height to prevent CLS -->
          <div class="text-center mb-8 min-h-[72px]">
            <h1 class="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p class="text-slate-600 dark:text-slate-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          <!-- Error Alert with reserved space to prevent CLS -->
          <div class="min-h-[56px] mb-2">
            @if (auth.error()) {
              <div class="p-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 text-sm animate-fade-in">
                {{ auth.error() }}
              </div>
            }
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <app-input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              [required]="true"
              [(ngModel)]="email"
              name="email"
              [error]="emailError()"
            />

            <app-input
              type="password"
              label="Password"
              placeholder="Enter your password"
              [required]="true"
              [(ngModel)]="password"
              name="password"
              [error]="passwordError()"
            />

            <div class="flex items-center justify-between text-sm min-h-[44px]">
              <label class="flex items-center gap-2 cursor-pointer min-h-[44px] touch-manipulation">
                <input
                  type="checkbox"
                  [(ngModel)]="rememberMe"
                  name="rememberMe"
                  class="w-5 h-5 rounded border-white/20 bg-white/10
                         text-primary-500 focus:ring-primary-500/50"
                />
                <span class="text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <a href="#" class="text-primary-400 hover:text-primary-300 transition-colors min-h-[44px] flex items-center touch-manipulation">
                Forgot password?
              </a>
            </div>

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [fullWidth]="true"
              [loading]="auth.loading()"
            >
              Sign In
            </app-button>
          </form>

          <!-- Footer -->
          <div class="mt-8 text-center min-h-[24px]">
            <p class="text-slate-600 dark:text-slate-400">
              Don't have an account?
              <a routerLink="/register" class="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Create one
              </a>
            </p>
          </div>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-transparent text-slate-500">Demo credentials</span>
            </div>
          </div>

          <!-- Demo Info -->
          <div class="text-center text-sm text-slate-500 dark:text-slate-400 min-h-[20px]">
            <p>Use any email and password (min 6 chars)</p>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  email = '';
  password = '';
  rememberMe = false;

  readonly emailError = signal('');
  readonly passwordError = signal('');

  async onSubmit(): Promise<void> {
    this.clearErrors();

    if (!this.validateForm()) {
      return;
    }

    const result = await this.auth.login({
      email: this.email,
      password: this.password,
    });

    if (result) {
      this.router.navigate(['/app/dashboard']);
    }
  }

  private validateForm(): boolean {
    let valid = true;

    if (!this.email) {
      this.emailError.set('Email is required');
      valid = false;
    } else if (!this.email.includes('@')) {
      this.emailError.set('Please enter a valid email');
      valid = false;
    }

    if (!this.password) {
      this.passwordError.set('Password is required');
      valid = false;
    } else if (this.password.length < 6) {
      this.passwordError.set('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  }

  private clearErrors(): void {
    this.emailError.set('');
    this.passwordError.set('');
    this.auth.clearError();
  }
}
