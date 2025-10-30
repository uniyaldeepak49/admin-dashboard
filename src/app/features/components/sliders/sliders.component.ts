import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sliders',
  standalone: true,
  imports: [MatCardModule, MatSliderModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './sliders.component.html',
  styleUrl: './sliders.component.scss',
})
export class SlidersComponent {
  basicValue = signal(50);
  rangeValue = signal(30);
  volumeValue = signal(75);
  priceValue = signal(250);
  temperatureValue = signal(22);
  progressValue = signal(65);

  resetValues() {
    this.basicValue.set(50);
    this.rangeValue.set(30);
    this.volumeValue.set(75);
    this.priceValue.set(250);
    this.temperatureValue.set(22);
    this.progressValue.set(65);
  }

  getTemperatureClass(): string {
    const temp = this.temperatureValue();
    if (temp < 15) return 'cold';
    if (temp < 25) return 'warm';
    return 'hot';
  }

  getTemperatureStatus(): string {
    const temp = this.temperatureValue();
    if (temp < 15) return 'Cold';
    if (temp < 25) return 'Comfortable';
    return 'Hot';
  }

  getProgressClass(): string {
    const progress = this.progressValue();
    if (progress < 40) return 'low';
    if (progress < 80) return 'medium';
    return 'high';
  }

  getProgressStatus(): string {
    const progress = this.progressValue();
    if (progress < 40) return 'Low';
    if (progress < 80) return 'Medium';
    return 'High';
  }
}
