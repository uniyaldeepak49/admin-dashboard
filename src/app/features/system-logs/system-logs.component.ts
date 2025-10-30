import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  user?: string;
}

@Component({
  selector: 'app-system-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss'],
})
export class SystemLogsComponent {
  logs = signal<LogEntry[]>([
    {
      id: 1,
      timestamp: '2024-01-15 10:30:25',
      level: 'info',
      message: 'User login successful',
      source: 'Auth Service',
      user: 'john.doe',
    },
    {
      id: 2,
      timestamp: '2024-01-15 10:28:15',
      level: 'warning',
      message: 'High memory usage detected',
      source: 'System Monitor',
    },
    {
      id: 3,
      timestamp: '2024-01-15 10:25:10',
      level: 'error',
      message: 'Database connection failed',
      source: 'Database Service',
    },
    {
      id: 4,
      timestamp: '2024-01-15 10:20:05',
      level: 'info',
      message: 'Backup completed successfully',
      source: 'Backup Service',
    },
    {
      id: 5,
      timestamp: '2024-01-15 10:15:30',
      level: 'debug',
      message: 'API request processed',
      source: 'API Gateway',
      user: 'jane.smith',
    },
  ]);

  logLevels = ['All', 'Info', 'Warning', 'Error', 'Debug'];
  selectedLevel = signal('All');

  clearLogs() {
    this.logs.set([]);
  }

  exportLogs() {
    console.log('Exporting logs');
  }

  refreshLogs() {
    console.log('Refreshing logs');
  }
}
