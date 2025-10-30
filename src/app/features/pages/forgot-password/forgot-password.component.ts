import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  emailSent = signal(false);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);

      setTimeout(() => {
        this.emailSent.set(true);
        this.isLoading.set(false);
        this.snackBar.open('Password reset email sent!', 'Close', { duration: 3000 });
      }, 1500);
    }
  }

  goToSignIn() {
    this.router.navigate(['/dashboard/pages/signin']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  resendEmail() {
    this.emailSent.set(false);
    this.forgotPasswordForm.reset();
  }
}
