import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  category: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTabsModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  selectedFilter = signal('all');
  selectedNotifications = signal<number[]>([]);

  notifications = signal<Notification[]>([
    {
      id: 1,
      title: 'System Update Complete',
      message:
        'The system has been successfully updated to version 2.1.0 with new features and security improvements.',
      time: '5 min ago',
      date: '2024-01-15',
      read: false,
      type: 'success',
      category: 'system',
    },
    {
      id: 2,
      title: 'New User Registration',
      message:
        'John Doe has successfully registered and joined the platform. Please review the new user profile.',
      time: '10 min ago',
      date: '2024-01-15',
      read: false,
      type: 'info',
      category: 'users',
    },
    {
      id: 3,
      title: 'Payment Processing Failed',
      message:
        'Payment processing failed for order #12345. Customer has been notified and support ticket created.',
      time: '15 min ago',
      date: '2024-01-15',
      read: true,
      type: 'error',
      category: 'payments',
    },
    {
      id: 4,
      title: 'Daily Backup Complete',
      message:
        'Daily database backup has been completed successfully. All data is secure and up to date.',
      time: '1 hour ago',
      date: '2024-01-15',
      read: true,
      type: 'success',
      category: 'system',
    },
    {
      id: 5,
      title: 'Security Alert',
      message:
        'Multiple failed login attempts detected from IP address 192.168.1.100. Account has been temporarily locked.',
      time: '2 hours ago',
      date: '2024-01-15',
      read: false,
      type: 'warning',
      category: 'security',
    },
    {
      id: 6,
      title: 'Server Maintenance Scheduled',
      message:
        'Scheduled maintenance will occur on Sunday from 2:00 AM to 6:00 AM EST. Services will be temporarily unavailable.',
      time: '3 hours ago',
      date: '2024-01-15',
      read: true,
      type: 'info',
      category: 'system',
    },
  ]);

  filters = signal([
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'system', label: 'System' },
    { value: 'users', label: 'Users' },
    { value: 'payments', label: 'Payments' },
    { value: 'security', label: 'Security' },
  ]);

  getFilteredNotifications(): Notification[] {
    const filter = this.selectedFilter();
    const notifications = this.notifications();

    switch (filter) {
      case 'unread':
        return notifications.filter((n) => !n.read);
      case 'all':
        return notifications;
      default:
        return notifications.filter((n) => n.category === filter);
    }
  }

  selectFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  markAsRead(notificationId: number): void {
    this.notifications.update((notifications) =>
      notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  }

  markAllAsRead(): void {
    this.notifications.update((notifications) => notifications.map((n) => ({ ...n, read: true })));
  }

  deleteNotification(notificationId: number): void {
    this.notifications.update((notifications) =>
      notifications.filter((n) => n.id !== notificationId),
    );
  }

  toggleSelection(notificationId: number): void {
    this.selectedNotifications.update((selected) => {
      const index = selected.indexOf(notificationId);
      if (index > -1) {
        return selected.filter((id) => id !== notificationId);
      } else {
        return [...selected, notificationId];
      }
    });
  }

  selectAll(): void {
    const filtered = this.getFilteredNotifications();
    this.selectedNotifications.set(filtered.map((n) => n.id));
  }

  clearSelection(): void {
    this.selectedNotifications.set([]);
  }

  deleteSelected(): void {
    const selected = this.selectedNotifications();
    this.notifications.update((notifications) =>
      notifications.filter((n) => !selected.includes(n.id)),
    );
    this.clearSelection();
  }

  getUnreadCount(): number {
    return this.notifications().filter((n) => !n.read).length;
  }

  getSuccessCount(): number {
    return this.notifications().filter((n) => n.type === 'success').length;
  }

  getErrorCount(): number {
    return this.notifications().filter((n) => n.type === 'error').length;
  }
}
