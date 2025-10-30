import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
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
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);
  isLoading = signal(false);

  changePasswordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordStrengthValidator],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  passwordStrengthValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const patterns = {
      number: /\d/,
      upper: /[A-Z]/,
      lower: /[a-z]/,
      special: /[!@#$%^&*(),.?":{}|<>]/,
    };

    const isValid = Object.values(patterns).every((pattern) => pattern.test(value));
    return isValid ? null : { weakPassword: true };
  }

  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.isLoading.set(true);

      setTimeout(() => {
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
        this.isLoading.set(false);
        this.changePasswordForm.reset();
      }, 1500);
    }
  }

  toggleCurrentPasswordVisibility() {
    this.hideCurrentPassword.set(!this.hideCurrentPassword());
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword.set(!this.hideNewPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
