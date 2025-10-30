import { Component, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info';
  icon: string;
  user?: string;
  avatar?: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TitleCasePipe, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  selectedType = signal('all');

  timelineEvents = signal<TimelineEvent[]>([
    {
      id: 1,
      title: 'System Update Completed',
      description:
        'Successfully updated the admin dashboard to version 2.1.0 with new features and security improvements.',
      date: '2024-01-15',
      time: '10:30 AM',
      type: 'success',
      icon: 'system_update',
      user: 'System Admin',
      avatar: 'SA',
    },
    {
      id: 2,
      title: 'New User Registration',
      description: 'John Smith has successfully registered and joined the platform.',
      date: '2024-01-15',
      time: '09:45 AM',
      type: 'info',
      icon: 'person_add',
      user: 'John Smith',
      avatar: 'JS',
    },
    {
      id: 3,
      title: 'Payment Processing Issue',
      description:
        'Payment gateway experienced temporary issues. All transactions have been restored.',
      date: '2024-01-14',
      time: '03:20 PM',
      type: 'warning',
      icon: 'payment',
      user: 'Payment System',
      avatar: 'PS',
    },
    {
      id: 4,
      title: 'Database Backup Failed',
      description:
        'Automated database backup failed due to storage limitations. Manual backup initiated.',
      date: '2024-01-14',
      time: '02:00 AM',
      type: 'error',
      icon: 'backup',
      user: 'Database Admin',
      avatar: 'DA',
    },
    {
      id: 5,
      title: 'Feature Release',
      description: 'New analytics dashboard features have been deployed to production environment.',
      date: '2024-01-13',
      time: '11:15 AM',
      type: 'success',
      icon: 'new_releases',
      user: 'Dev Team',
      avatar: 'DT',
    },
    {
      id: 6,
      title: 'Security Scan Completed',
      description: 'Weekly security vulnerability scan completed. No critical issues found.',
      date: '2024-01-12',
      time: '08:00 AM',
      type: 'info',
      icon: 'security',
      user: 'Security Team',
      avatar: 'ST',
    },
  ]);

  eventTypes = signal([
    { value: 'all', label: 'All Events', color: '' },
    { value: 'success', label: 'Success', color: 'success' },
    { value: 'info', label: 'Information', color: 'info' },
    { value: 'warning', label: 'Warning', color: 'warning' },
    { value: 'error', label: 'Error', color: 'error' },
  ]);

  filteredEvents = signal<TimelineEvent[]>([]);

  constructor() {
    this.updateFilteredEvents();
  }

  selectType(type: string): void {
    this.selectedType.set(type);
    this.updateFilteredEvents();
  }

  private updateFilteredEvents(): void {
    const type = this.selectedType();
    if (type === 'all') {
      this.filteredEvents.set(this.timelineEvents());
    } else {
      this.filteredEvents.set(this.timelineEvents().filter((event) => event.type === type));
    }
  }

  getTypeColor(type: string): string {
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  }
}
