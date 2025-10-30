import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent {
  isLoading = signal(false);
  selectedAlignment = signal('left');

  simulateLoading() {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 2000);
  }

  onButtonClick(action: string) {
    console.log('Button clicked:', action);
  }
}
