import { Component, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  bio: string;
  avatar: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private fb = inject(FormBuilder);

  isEditing = signal(false);
  profileForm: FormGroup;

  userProfile = signal<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    role: 'Senior Developer',
    bio: 'Experienced full-stack developer with expertise in Angular, Node.js, and cloud technologies.',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  });

  departments = signal(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']);

  roles = signal([
    'Junior Developer',
    'Senior Developer',
    'Team Lead',
    'Manager',
    'Director',
    'VP',
  ]);

  constructor() {
    this.profileForm = this.createForm();
  }

  private createForm(): FormGroup {
    const profile = this.userProfile();
    return this.fb.group({
      firstName: [profile.firstName, [Validators.required]],
      lastName: [profile.lastName, [Validators.required]],
      email: [profile.email, [Validators.required, Validators.email]],
      phone: [profile.phone],
      department: [profile.department],
      role: [profile.role],
      bio: [profile.bio],
    });
  }

  toggleEdit(): void {
    this.isEditing.update((editing) => !editing);
    if (!this.isEditing()) {
      this.profileForm.patchValue(this.userProfile());
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.userProfile.set({
        ...this.userProfile(),
        ...this.profileForm.value,
      });
      this.isEditing.set(false);
    }
  }

  cancelEdit(): void {
    this.profileForm.patchValue(this.userProfile());
    this.isEditing.set(false);
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userProfile.update((profile) => ({
          ...profile,
          avatar: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
