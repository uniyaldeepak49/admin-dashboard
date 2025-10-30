import {
  Component,
  signal,
  computed,
  viewChild,
  ElementRef,
  AfterViewInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { ChartService } from '../../core/services/chart.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatChipsModule,
    MatToolbarModule,
    MatListModule,
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements AfterViewInit {
  trafficChart = viewChild.required<ElementRef<HTMLCanvasElement>>('trafficChart');
  revenueChart = viewChild.required<ElementRef<HTMLCanvasElement>>('revenueChart');
  deviceChart = viewChild.required<ElementRef<HTMLCanvasElement>>('deviceChart');
  geographyChart = viewChild.required<ElementRef<HTMLCanvasElement>>('geographyChart');

  private chartService = inject(ChartService);

  selectedPeriod = signal('30days');
  selectedMetric = signal('revenue');

  private analyticsData = signal(this.getAnalyticsData());

  metrics = computed(() => {
    const data = this.analyticsData();
    const period = this.selectedPeriod() as keyof typeof data.metrics;
    return data.metrics[period] || data.metrics['30days'];
  });

  trafficSources = computed(() => this.analyticsData().trafficSources);
  deviceBreakdown = computed(() => this.analyticsData().deviceBreakdown);
  topPages = computed(() => this.analyticsData().topPages);
  geographyData = computed(() => this.analyticsData().geography);
  realTimeStats = computed(() => this.analyticsData().realTime);
  conversionFunnel = computed(() => this.analyticsData().conversionFunnel);

  private getAnalyticsData() {
    return {
      metrics: {
        '7days': [
          { title: 'Page Views', value: 12543, change: 8.2, icon: 'visibility', trend: 'up' },
          { title: 'Unique Visitors', value: 3421, change: 12.5, icon: 'people', trend: 'up' },
          {
            title: 'Bounce Rate',
            value: 32.1,
            change: -2.3,
            icon: 'exit_to_app',
            trend: 'down',
            unit: '%',
          },
          {
            title: 'Avg Session',
            value: 245,
            change: 5.7,
            icon: 'schedule',
            trend: 'up',
            unit: 's',
          },
        ],
        '30days': [
          { title: 'Page Views', value: 45231, change: 15.3, icon: 'visibility', trend: 'up' },
          { title: 'Unique Visitors', value: 12847, change: 18.7, icon: 'people', trend: 'up' },
          {
            title: 'Bounce Rate',
            value: 28.4,
            change: -5.2,
            icon: 'exit_to_app',
            trend: 'down',
            unit: '%',
          },
          {
            title: 'Avg Session',
            value: 312,
            change: 8.9,
            icon: 'schedule',
            trend: 'up',
            unit: 's',
          },
        ],
      },
      trafficSources: [
        { source: 'Organic Search', visitors: 8234, percentage: 45.2, change: 12.3 },
        { source: 'Direct Traffic', visitors: 5621, percentage: 30.8, change: -2.1 },
        { source: 'Social Media', visitors: 2847, percentage: 15.6, change: 25.7 },
        { source: 'Email Campaign', visitors: 1534, percentage: 8.4, change: 8.9 },
      ],
      deviceBreakdown: [
        { device: 'Desktop', users: 9876, percentage: 54.3 },
        { device: 'Mobile', users: 6543, percentage: 36.0 },
        { device: 'Tablet', users: 1765, percentage: 9.7 },
      ],
      topPages: [
        { page: '/dashboard', views: 8234, time: '3:45', bounce: 25.3 },
        { page: '/products', views: 5621, time: '2:12', bounce: 32.1 },
        { page: '/about', views: 3847, time: '1:58', bounce: 45.2 },
        { page: '/contact', views: 2156, time: '1:23', bounce: 52.7 },
      ],
      geography: [
        { country: 'United States', users: 5234, percentage: 28.7 },
        { country: 'United Kingdom', users: 3421, percentage: 18.8 },
        { country: 'Germany', users: 2847, percentage: 15.6 },
        { country: 'France', users: 2156, percentage: 11.8 },
        { country: 'Canada', users: 1876, percentage: 10.3 },
      ],
      realTime: {
        activeUsers: 247,
        pageViews: 1543,
        events: 892,
        conversions: 23,
      },
      conversionFunnel: [
        { stage: 'Visitors', count: 18234, rate: 100 },
        { stage: 'Product Interest', count: 9876, rate: 54.2 },
        { stage: 'Add to Cart', count: 3421, rate: 18.8 },
        { stage: 'Checkout', count: 1234, rate: 6.8 },
        { stage: 'Purchase', count: 587, rate: 3.2 },
      ],
    };
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  private initializeCharts() {
    this.chartService.createTrafficChart(this.trafficChart().nativeElement);
    this.chartService.createRevenueChart(this.revenueChart().nativeElement);
    this.chartService.createDeviceChart(this.deviceChart().nativeElement);
    this.chartService.createGeographyChart(this.geographyChart().nativeElement);
  }

  onPeriodChange(period: string) {
    this.selectedPeriod.set(period);
  }

  onMetricChange(metric: string) {
    this.selectedMetric.set(metric);
  }

  exportReport() {
    // Export analytics report
  }

  getSourceIcon(source: string): string {
    const icons: Record<string, string> = {
      Google: 'search',
      Direct: 'link',
      'Social Media': 'share',
      Email: 'email',
      Referral: 'launch',
    };
    return icons[source] || 'web';
  }

  getDeviceIcon(device: string): string {
    const icons: Record<string, string> = {
      Desktop: 'computer',
      Mobile: 'smartphone',
      Tablet: 'tablet',
    };
    return icons[device] || 'devices';
  }

  getFunnelIcon(index: number): string {
    const icons = ['visibility', 'shopping_cart', 'payment', 'check_circle'];
    return icons[index] || 'circle';
  }
}
