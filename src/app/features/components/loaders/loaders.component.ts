import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loaders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './loaders.component.html',
  styleUrls: ['./loaders.component.scss'],
})
export class LoadersComponent {
  progressValue = signal(40);
  isLoading = signal(false);

  simulateProgress() {
    this.progressValue.set(0);
    const interval = setInterval(() => {
      this.progressValue.update((current) => {
        if (current >= 100) {
          clearInterval(interval);
          return 100;
        }
        return current + 10;
      });
    }, 200);
  }

  simulateLoading() {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 3000);
  }
}
