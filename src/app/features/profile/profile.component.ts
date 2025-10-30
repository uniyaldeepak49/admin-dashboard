import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  bio: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  isEditing = signal(false);

  userProfile = signal<UserProfile>({
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Administrator',
    department: 'IT',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced administrator with expertise in system management and team leadership.',
  });

  profileForm = this.fb.group({
    name: [this.userProfile().name, [Validators.required]],
    email: [this.userProfile().email, [Validators.required, Validators.email]],
    role: [this.userProfile().role, [Validators.required]],
    department: [this.userProfile().department, [Validators.required]],
    phone: [this.userProfile().phone],
    bio: [this.userProfile().bio],
  });

  roles = ['Administrator', 'Manager', 'Editor', 'Viewer'];
  departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
    if (!this.isEditing()) {
      this.profileForm.patchValue(this.userProfile());
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.value as UserProfile;
      this.userProfile.set(updatedProfile);
      this.isEditing.set(false);
      this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
    }
  }

  cancelEdit() {
    this.profileForm.patchValue(this.userProfile());
    this.isEditing.set(false);
  }
}
