import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './conversion.component.html',
  styleUrl: './conversion.component.scss',
})
export class ConversionComponent {
  conversionData = signal({
    rate: 3.2,
    growth: 5.4,
    visitors: 15420,
    conversions: 493,
    funnel: [
      { stage: 'Visitors', count: 15420, rate: 100 },
      { stage: 'Product Views', count: 8234, rate: 53.4 },
      { stage: 'Add to Cart', count: 2156, rate: 14.0 },
      { stage: 'Checkout', count: 847, rate: 5.5 },
      { stage: 'Purchase', count: 493, rate: 3.2 },
    ],
    channels: [
      { name: 'Organic Search', conversions: 187, rate: 4.2 },
      { name: 'Social Media', conversions: 124, rate: 2.8 },
      { name: 'Email Campaign', conversions: 98, rate: 6.1 },
      { name: 'Direct Traffic', conversions: 84, rate: 2.1 },
    ],
  });

  totalConversions = computed(() =>
    this.conversionData().channels.reduce((sum, channel) => sum + channel.conversions, 0),
  );
}
