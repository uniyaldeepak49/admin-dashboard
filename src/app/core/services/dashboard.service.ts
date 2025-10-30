import { Injectable, signal } from '@angular/core';
import { DashboardStats } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private stats = signal<DashboardStats>({
    totalUsers: 1234,
    revenue: 12345,
  });

  private activities = signal([
    {
      id: 1,
      type: 'user',
      icon: 'person_add',
      title: 'New User Registration',
      description: 'John Doe joined',
      time: '2h ago',
    },
    {
      id: 2,
      type: 'payment',
      icon: 'payment',
      title: 'Payment Processed',
      description: '$299.00 from Order #1234',
      time: '4h ago',
    },
    {
      id: 3,
      type: 'order',
      icon: 'shopping_cart',
      title: 'New Order',
      description: 'Order #5678 placed',
      time: '6h ago',
    },
    {
      id: 4,
      type: 'system',
      icon: 'security',
      title: 'Security Update',
      description: 'System updated successfully',
      time: '1d ago',
    },
  ]);

  private metrics = signal([
    { name: 'Server Response', value: 92, color: 'primary' },
    { name: 'User Satisfaction', value: 88, color: 'accent' },
    { name: 'API Performance', value: 95, color: 'primary' },
    { name: 'System Health', value: 89, color: 'warn' },
  ]);

  private goals = signal([
    { name: 'Monthly Revenue', current: 85000, target: 100000, percentage: 85 },
    { name: 'New Customers', current: 340, target: 400, percentage: 85 },
    { name: 'Product Sales', current: 1250, target: 1500, percentage: 83 },
  ]);

  private topProducts = signal([
    { name: 'Premium Plan', sales: 1234, revenue: 49360, trend: '+12%' },
    { name: 'Basic Plan', sales: 856, revenue: 25680, trend: '+8%' },
    { name: 'Enterprise', sales: 234, revenue: 46800, trend: '+15%' },
  ]);

  private supportTickets = signal([
    { id: 'T-001', title: 'Login Issue', priority: 'high', status: 'open', time: '30m ago' },
    { id: 'T-002', title: 'Payment Failed', priority: 'medium', status: 'pending', time: '1h ago' },
    { id: 'T-003', title: 'Feature Request', priority: 'low', status: 'resolved', time: '2h ago' },
  ]);

  private quickActions = signal([
    { icon: 'add', label: 'Add User', action: 'add-user' },
    { icon: 'upload', label: 'Import Data', action: 'import' },
    { icon: 'download', label: 'Export Report', action: 'export' },
    { icon: 'settings', label: 'Settings', action: 'settings' },
  ]);

  private liveStats = signal({
    visitors: 1247,
    pageViews: 3456,
    bounceRate: 32.5,
    avgSession: '2m 34s',
  });

  private systemHealth = signal([
    { name: 'CPU Usage', value: 45, status: 'good' },
    { name: 'Memory', value: 67, status: 'warning' },
    { name: 'Disk Space', value: 23, status: 'good' },
    { name: 'Network', value: 89, status: 'excellent' },
  ]);

  private aiInsights = signal([
    {
      type: 'opportunity',
      title: 'Revenue Growth',
      description: 'Increase pricing by 8% could boost revenue by $12K',
      confidence: 92,
    },
    {
      type: 'warning',
      title: 'Churn Risk',
      description: '15 customers showing signs of churn',
      confidence: 87,
    },
    {
      type: 'trend',
      title: 'Peak Hours',
      description: 'Traffic peaks at 2-4 PM, optimize resources',
      confidence: 95,
    },
  ]);

  getStats = this.stats.asReadonly();
  getActivities = this.activities.asReadonly();
  getMetrics = this.metrics.asReadonly();
  getGoals = this.goals.asReadonly();
  getTopProducts = this.topProducts.asReadonly();
  getSupportTickets = this.supportTickets.asReadonly();
  getQuickActions = this.quickActions.asReadonly();
  getLiveStats = this.liveStats.asReadonly();
  getSystemHealth = this.systemHealth.asReadonly();
  getAiInsights = this.aiInsights.asReadonly();
}
