import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../../core/services/theme.service';

interface AppSettings {
  notifications: boolean;
  emailAlerts: boolean;
  autoSave: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private snackBar = inject(MatSnackBar);
  themeService = inject(ThemeService);

  settings = signal<AppSettings>({
    notifications: true,
    emailAlerts: false,
    autoSave: true,
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
  });

  languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ];

  timezones = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (UTC+0)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
  ];

  dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ];

  updateSetting(key: keyof AppSettings, value: boolean | string) {
    this.settings.update((current) => ({ ...current, [key]: value }));
  }

  saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(this.settings()));
    this.snackBar.open('Settings saved successfully', 'Close', { duration: 3000 });
  }

  resetSettings() {
    this.settings.set({
      notifications: true,
      emailAlerts: false,
      autoSave: true,
      language: 'en',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
    });
    this.snackBar.open('Settings reset to defaults', 'Close', { duration: 3000 });
  }
}
