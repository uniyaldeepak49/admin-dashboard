import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DataTableComponent } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    DataTableComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private readonly ordersData = signal(this.getOrdersDataInit());
  private readonly recentOrders = signal(this.getRecentOrdersInit());
  pageIndex = signal(0);
  pageSize = signal(5);

  private getOrdersDataInit() {
    return {
      total: 856,
      pending: 23,
      completed: 789,
      cancelled: 44,
      growth: -3.1,
      avgValue: 145.5,
    };
  }

  private getRecentOrdersInit() {
    return [
      {
        id: 'ORD-001',
        customer: 'John Doe',
        amount: 299.99,
        status: 'completed',
        date: '2024-01-15',
      },
      {
        id: 'ORD-002',
        customer: 'Jane Smith',
        amount: 149.5,
        status: 'pending',
        date: '2024-01-15',
      },
      {
        id: 'ORD-003',
        customer: 'Bob Wilson',
        amount: 89.99,
        status: 'processing',
        date: '2024-01-14',
      },
      {
        id: 'ORD-004',
        customer: 'Alice Johnson',
        amount: 199.99,
        status: 'completed',
        date: '2024-01-14',
      },
      {
        id: 'ORD-005',
        customer: 'Mike Brown',
        amount: 75.0,
        status: 'cancelled',
        date: '2024-01-13',
      },
    ];
  }

  readonly orderColumns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, type: 'number' as const },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'date', label: 'Date', sortable: true, type: 'date' as const },
  ];

  readonly orderActions = [
    { icon: 'visibility', label: 'View order', action: 'view' },
    { icon: 'edit', label: 'Edit order', action: 'edit' },
  ];

  // Expose data through getters
  getOrdersData = this.ordersData.asReadonly();
  getRecentOrders = this.recentOrders.asReadonly();

  completionRate = computed(() =>
    Math.round((this.ordersData().completed / this.ordersData().total) * 100),
  );

  onOrderAction(event: { action: string; row: any }) {
    // Handle order actions securely
    if (event.action && event.row?.id) {
      // Process action based on type
    }
  }
}
