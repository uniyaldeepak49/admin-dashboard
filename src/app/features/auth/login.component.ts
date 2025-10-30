import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  hidePassword = signal(true);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  demoUsers = [
    { email: 'admin@company.com', role: 'Admin' },
    { email: 'editor@company.com', role: 'Editor' },
    { email: 'viewer@company.com', role: 'Viewer' },
  ];

  login() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      setTimeout(() => {
        const { email, password, rememberMe } = this.loginForm.value;
        const success = this.authService.login(email!, password!, rememberMe!);

        if (!success) {
          this.snackBar.open('Invalid credentials. Use password123 for demo accounts.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar'],
          });
        }

        this.isLoading.set(false);
      }, 1000);
    }
  }

  fillDemoCredentials(email: string) {
    this.loginForm.patchValue({
      email,
      password: 'password123',
    });
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }
}
