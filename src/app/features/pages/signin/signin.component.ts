import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hidePassword = signal(true);
  isLoading = signal(false);

  signinForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  onSubmit() {
    if (this.signinForm.valid) {
      this.isLoading.set(true);

      try {
        setTimeout(() => {
          this.snackBar.open('Sign in successful!', 'Close', { duration: 3000 });
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']).catch((error) => {
            console.error('Navigation error:', error);
            this.snackBar.open('Navigation failed. Please try again.', 'Close', { duration: 3000 });
          });
        }, 1500);
      } catch (error) {
        console.error('Sign in error:', error);
        this.isLoading.set(false);
        this.snackBar.open('Sign in failed. Please try again.', 'Close', { duration: 3000 });
      }
    }
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']).catch((error) => {
      console.error('Navigation error:', error);
      this.snackBar.open('Navigation failed. Please try again.', 'Close', { duration: 3000 });
    });
  }
}
