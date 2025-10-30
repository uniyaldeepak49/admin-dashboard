import { Component, inject, viewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
} from '../../shared/components/data-table.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartService } from '../../core/services/chart.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    DataTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard-sections.scss'],
})
export class DashboardComponent implements AfterViewInit {
  revenueChart = viewChild.required<ElementRef<HTMLCanvasElement>>('revenueChart');
  userChart = viewChild.required<ElementRef<HTMLCanvasElement>>('userChart');

  dashboardService = inject(DashboardService);
  chartService = inject(ChartService);
  usersService = inject(UsersService);

  router = inject(Router);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(5);

  stats = this.dashboardService.getStats;
  activities = this.dashboardService.getActivities;
  metrics = this.dashboardService.getMetrics;
  goals = this.dashboardService.getGoals;
  topProducts = this.dashboardService.getTopProducts;
  supportTickets = this.dashboardService.getSupportTickets;
  quickActions = this.dashboardService.getQuickActions;
  liveStats = this.dashboardService.getLiveStats;
  systemHealth = this.dashboardService.getSystemHealth;
  aiInsights = this.dashboardService.getAiInsights;
  users = this.usersService.getUsers;

  currentTime = signal(new Date());

  userColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  userActions: TableAction[] = [
    { icon: 'visibility', label: 'View user', action: 'view' },
    { icon: 'edit', label: 'Edit user', action: 'edit' },
  ];

  ngAfterViewInit() {
    this.chartService.createRevenueChart(this.revenueChart().nativeElement);
    this.chartService.createUserChart(this.userChart().nativeElement);
  }

  getMetricIcon(metricName: string): string {
    const icons: Record<string, string> = {
      'CPU Usage': 'memory',
      Memory: 'storage',
      'Disk Space': 'hard_drive',
      Network: 'network_check',
      'Response Time': 'speed',
    };
    return icons[metricName] || 'analytics';
  }

  getMetricIconClass(value: number): string {
    if (value >= 80) return 'metric-icon excellent';
    if (value >= 60) return 'metric-icon good';
    if (value >= 40) return 'metric-icon warning';
    return 'metric-icon critical';
  }

  getMetricColor(value: number): 'primary' | 'accent' | 'warn' {
    if (value >= 70) return 'primary';
    if (value >= 50) return 'accent';
    return 'warn';
  }

  getMetricStatus(value: number): string {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Poor';
  }

  onUserAction(event: { action: string; row: any }) {
    console.log('User action:', event.action, 'User:', event.row);
  }

  onQuickAction(action: string) {
    console.log('Quick action:', action);
  }

  onTicketAction(ticket: any, action: string) {
    console.log('Ticket action:', action, 'Ticket:', ticket);
  }

  navigateToRevenue() {
    this.router.navigate(['/dashboard/revenue']);
  }

  navigateToUsers() {
    this.router.navigate(['/dashboard/users']);
  }

  navigateToOrders() {
    this.router.navigate(['/dashboard/orders']);
  }

  navigateToConversion() {
    this.router.navigate(['/dashboard/conversion']);
  }

  exportReport() {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();

      // Header
      doc.setFontSize(20);
      doc.text('Dashboard Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${date}`, 20, 30);

      // KPI Metrics
      doc.setFontSize(16);
      doc.text('Key Performance Indicators', 20, 50);
      doc.setFontSize(12);
      const stats = this.stats();
      doc.text(`Total Revenue: $${stats.revenue}`, 20, 65);
      doc.text(`Active Users: ${stats.totalUsers}`, 20, 75);

      // Goals
      doc.setFontSize(16);
      doc.text('Goal Tracking', 20, 95);
      doc.setFontSize(12);
      let yPos = 110;
      this.goals().forEach((goal) => {
        doc.text(`${goal.name}: ${goal.percentage}% (${goal.current}/${goal.target})`, 20, yPos);
        yPos += 10;
      });

      // System Health
      doc.setFontSize(16);
      doc.text('System Health', 20, yPos + 10);
      doc.setFontSize(12);
      yPos += 25;
      this.systemHealth().forEach((system) => {
        doc.text(`${system.name}: ${system.value}% (${system.status})`, 20, yPos);
        yPos += 10;
      });

      doc.save(`Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    });
  }

  exportExcel() {
    import('xlsx').then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // KPI Sheet
      const kpiData = [
        ['Metric', 'Value'],
        ['Total Revenue', `$${this.stats().revenue}`],
        ['Active Users', this.stats().totalUsers],
        ['Total Orders', '856'],
        ['Conversion Rate', '3.2%'],
      ];
      const kpiWs = XLSX.utils.aoa_to_sheet(kpiData);
      XLSX.utils.book_append_sheet(wb, kpiWs, 'KPI Metrics');

      // Goals Sheet
      const goalsData = [['Goal', 'Current', 'Target', 'Percentage']];
      this.goals().forEach((goal) => {
        goalsData.push([
          goal.name,
          goal.current.toString(),
          goal.target.toString(),
          `${goal.percentage}%`,
        ]);
      });
      const goalsWs = XLSX.utils.aoa_to_sheet(goalsData);
      XLSX.utils.book_append_sheet(wb, goalsWs, 'Goals');

      // Users Sheet
      const usersData = [['Name', 'Email', 'Role', 'Status']];
      this.users()
        .slice(0, 20)
        .forEach((user) => {
          usersData.push([user.name, user.email, user.role, user.status]);
        });
      const usersWs = XLSX.utils.aoa_to_sheet(usersData);
      XLSX.utils.book_append_sheet(wb, usersWs, 'Users');

      XLSX.writeFile(wb, `Dashboard_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  }
}
