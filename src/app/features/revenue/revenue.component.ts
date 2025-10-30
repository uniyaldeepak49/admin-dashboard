import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
  ],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss',
})
export class RevenueComponent {
  revenueData = signal({
    total: 125340,
    growth: 12.5,
    target: 150000,
    monthly: [
      { month: 'Jan', amount: 8500, growth: 5.2 },
      { month: 'Feb', amount: 9200, growth: 8.2 },
      { month: 'Mar', amount: 10100, growth: 9.8 },
      { month: 'Apr', amount: 11500, growth: 13.9 },
      { month: 'May', amount: 12300, growth: 7.0 },
      { month: 'Jun', amount: 13200, growth: 7.3 },
    ],
    sources: [
      { name: 'Subscriptions', amount: 75200, percentage: 60 },
      { name: 'One-time Sales', amount: 37608, percentage: 30 },
      { name: 'Partnerships', amount: 12532, percentage: 10 },
    ],
  });

  progressPercentage = computed(() =>
    Math.round((this.revenueData().total / this.revenueData().target) * 100),
  );
}
