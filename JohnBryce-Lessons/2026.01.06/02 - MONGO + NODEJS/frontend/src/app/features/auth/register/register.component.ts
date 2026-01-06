import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-register',
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
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold gradient-text mb-2">Create Account</h1>
            <p class="text-slate-600 dark:text-slate-400">
              Start managing your products today
            </p>
          </div>

          <!-- Error Alert -->
          @if (auth.error()) {
            <div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 text-sm">
              {{ auth.error() }}
            </div>
          }

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <app-input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              [required]="true"
              [(ngModel)]="name"
              name="name"
              [error]="nameError()"
            />

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
              placeholder="Create a strong password"
              hint="Must be at least 6 characters"
              [required]="true"
              [(ngModel)]="password"
              name="password"
              [error]="passwordError()"
            />

            <app-input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              [required]="true"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              [error]="confirmPasswordError()"
            />

            <div class="flex items-start gap-2">
              <input
                type="checkbox"
                [(ngModel)]="acceptTerms"
                name="acceptTerms"
                class="mt-1 w-4 h-4 rounded border-white/20 bg-white/10
                       text-primary-500 focus:ring-primary-500/50"
              />
              <label class="text-sm text-slate-600 dark:text-slate-400">
                I agree to the
                <a href="#" class="text-primary-400 hover:text-primary-300">Terms of Service</a>
                and
                <a href="#" class="text-primary-400 hover:text-primary-300">Privacy Policy</a>
              </label>
            </div>
            @if (termsError()) {
              <p class="text-sm text-red-400 -mt-3">{{ termsError() }}</p>
            }

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [fullWidth]="true"
              [loading]="auth.loading()"
            >
              Create Account
            </app-button>
          </form>

          <!-- Footer -->
          <div class="mt-8 text-center">
            <p class="text-slate-600 dark:text-slate-400">
              Already have an account?
              <a routerLink="/login" class="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;

  readonly nameError = signal('');
  readonly emailError = signal('');
  readonly passwordError = signal('');
  readonly confirmPasswordError = signal('');
  readonly termsError = signal('');

  async onSubmit(): Promise<void> {
    this.clearErrors();

    if (!this.validateForm()) {
      return;
    }

    const result = await this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password,
    });

    if (result) {
      this.router.navigate(['/app/dashboard']);
    }
  }

  private validateForm(): boolean {
    let valid = true;

    if (!this.name) {
      this.nameError.set('Name is required');
      valid = false;
    } else if (this.name.length < 2) {
      this.nameError.set('Name must be at least 2 characters');
      valid = false;
    }

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

    if (!this.confirmPassword) {
      this.confirmPasswordError.set('Please confirm your password');
      valid = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError.set('Passwords do not match');
      valid = false;
    }

    if (!this.acceptTerms) {
      this.termsError.set('You must accept the terms and conditions');
      valid = false;
    }

    return valid;
  }

  private clearErrors(): void {
    this.nameError.set('');
    this.emailError.set('');
    this.passwordError.set('');
    this.confirmPasswordError.set('');
    this.termsError.set('');
    this.auth.clearError();
  }
}
