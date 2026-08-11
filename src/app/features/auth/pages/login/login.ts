import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Email and password are required.');
      return;
    }

    this.isLoading.set(true);

    this.authService.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: response => {
        console.log('Login successful:', response);

        this.isLoading.set(false);

        this.router.navigate(['/dashboard']);
      },

      error: error => {
        console.error('Login failed:', error);

        this.errorMessage.set(
          error?.error?.message ?? 'Invalid email or password.'
        );

        this.isLoading.set(false);
      }
    });
  }
}
