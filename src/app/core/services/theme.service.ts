import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = signal(this.getInitialTheme());

  constructor() {
    // Apply theme on initialization
    this.updateTheme();

    // Watch for theme changes and persist to localStorage
    effect(() => {
      this.updateTheme();
      try {
        localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update((value) => !value);
  }

  private getInitialTheme(): boolean {
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
    } catch (error) {
      console.error('Failed to read theme from localStorage:', error);
    }

    // Fall back to system preference
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.error('Failed to read system theme preference:', error);
      return false; // Default to light theme
    }
  }

  private updateTheme() {
    try {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    } catch (error) {
      console.error('Failed to update theme classes:', error);
    }
  }
}
