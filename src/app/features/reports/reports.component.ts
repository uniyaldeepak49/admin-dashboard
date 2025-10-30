import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  selectedReport = signal('sales');
  dateRange = signal({ start: new Date(), end: new Date() });

  reports = [
    { value: 'sales', label: 'Sales Report', icon: 'trending_up' },
    { value: 'users', label: 'User Activity', icon: 'people' },
    { value: 'financial', label: 'Financial Report', icon: 'account_balance' },
    { value: 'inventory', label: 'Inventory Report', icon: 'inventory' },
  ];

  generateReport() {
    console.log('Generating report:', this.selectedReport());
  }

  exportReport(format: string) {
    console.log('Exporting report as:', format);
  }
}
