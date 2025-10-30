import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Custom validators
  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial && value.length >= 8;
    return valid ? null : { weakPassword: true };
  }

  static confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  basicForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, FormsComponent.phoneValidator]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });

  advancedForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, FormsComponent.passwordValidator]],
    confirmPassword: ['', [Validators.required, FormsComponent.confirmPasswordValidator]],
    country: ['', [Validators.required]],
    city: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    website: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    newsletter: [false],
    notifications: [true],
    skills: ['', [Validators.required]],
  });

  stepperForm = this.fb.group({
    personalInfo: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
    }),
    addressInfo: this.fb.group({
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', [Validators.required]],
    }),
    preferences: this.fb.group({
      newsletter: [false],
      notifications: [true],
      terms: [false, [Validators.requiredTrue]],
    }),
  });

  countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan'];
  genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  skills = ['Angular', 'React', 'Vue', 'Node.js', 'Python', 'Java'];

  getErrorMessage(formName: string, fieldName: string): string {
    let field: any;

    if (formName === 'basic') {
      field = this.basicForm.get(fieldName);
    } else if (formName === 'advanced') {
      field = this.advancedForm.get(fieldName);
    } else {
      field = this.stepperForm.get(fieldName);
    }

    if (field?.hasError('required')) return `${fieldName} is required`;
    if (field?.hasError('email')) return 'Please enter a valid email';
    if (field?.hasError('minlength'))
      return `Minimum ${field.errors?.['minlength'].requiredLength} characters required`;
    if (field?.hasError('maxlength'))
      return `Maximum ${field.errors?.['maxlength'].requiredLength} characters allowed`;
    if (field?.hasError('min')) return `Minimum value is ${field.errors?.['min'].min}`;
    if (field?.hasError('max')) return `Maximum value is ${field.errors?.['max'].max}`;
    if (field?.hasError('pattern')) return 'Invalid format';
    if (field?.hasError('invalidPhone')) return 'Please enter a valid phone number';
    if (field?.hasError('weakPassword'))
      return 'Password must contain uppercase, lowercase, number, and special character';
    if (field?.hasError('passwordMismatch')) return 'Passwords do not match';
    if (field?.hasError('requiredTrue')) return 'You must accept the terms';

    return '';
  }

  onBasicSubmit() {
    if (this.basicForm.valid) {
      this.snackBar.open('Basic form submitted successfully!', 'Close', { duration: 3000 });
      console.log('Basic form:', this.basicForm.value);
    } else {
      this.markFormGroupTouched(this.basicForm);
      this.snackBar.open('Please fix the errors in the form', 'Close', { duration: 3000 });
    }
  }

  onAdvancedSubmit() {
    if (this.advancedForm.valid) {
      this.snackBar.open('Advanced form submitted successfully!', 'Close', { duration: 3000 });
      console.log('Advanced form:', this.advancedForm.value);
    } else {
      this.markFormGroupTouched(this.advancedForm);
      this.snackBar.open('Please fix the errors in the form', 'Close', { duration: 3000 });
    }
  }

  onStepperSubmit() {
    if (this.stepperForm.valid) {
      this.snackBar.open('Stepper form submitted successfully!', 'Close', { duration: 3000 });
      console.log('Stepper form:', this.stepperForm.value);
    } else {
      this.markFormGroupTouched(this.stepperForm);
      this.snackBar.open('Please complete all required fields', 'Close', { duration: 3000 });
    }
  }

  private markFormGroupTouched(formGroup: any) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control?.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
