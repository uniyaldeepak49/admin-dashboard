import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface GridItem {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-grids',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatIconModule, MatButtonModule],
  templateUrl: './grids.component.html',
  styleUrl: './grids.component.scss',
})
export class GridsComponent {
  basicGridItems = signal<GridItem[]>([
    {
      title: 'Dashboard',
      subtitle: 'Overview',
      icon: 'dashboard',
      color: '#3b82f6',
      cols: 1,
      rows: 1,
    },
    {
      title: 'Analytics',
      subtitle: 'Reports',
      icon: 'analytics',
      color: '#10b981',
      cols: 1,
      rows: 1,
    },
    { title: 'Users', subtitle: 'Management', icon: 'people', color: '#f59e0b', cols: 1, rows: 1 },
    {
      title: 'Settings',
      subtitle: 'Configuration',
      icon: 'settings',
      color: '#ef4444',
      cols: 1,
      rows: 1,
    },
  ]);

  dynamicGridItems = signal<GridItem[]>([
    {
      title: 'Revenue',
      subtitle: '$45,231',
      icon: 'attach_money',
      color: '#10b981',
      cols: 2,
      rows: 1,
    },
    {
      title: 'Orders',
      subtitle: '1,234',
      icon: 'shopping_cart',
      color: '#3b82f6',
      cols: 1,
      rows: 1,
    },
    { title: 'Customers', subtitle: '5,678', icon: 'people', color: '#f59e0b', cols: 1, rows: 1 },
    { title: 'Performance', subtitle: '98.5%', icon: 'speed', color: '#8b5cf6', cols: 2, rows: 2 },
    {
      title: 'Tasks',
      subtitle: '23 pending',
      icon: 'assignment',
      color: '#ef4444',
      cols: 1,
      rows: 1,
    },
    { title: 'Messages', subtitle: '12 new', icon: 'message', color: '#06b6d4', cols: 1, rows: 1 },
  ]);

  responsiveItems = signal([
    { title: 'Mobile', icon: 'phone_android', value: '45%' },
    { title: 'Desktop', icon: 'desktop_windows', value: '35%' },
    { title: 'Tablet', icon: 'tablet', value: '20%' },
    { title: 'Chrome', icon: 'web', value: '60%' },
    { title: 'Firefox', icon: 'web', value: '25%' },
    { title: 'Safari', icon: 'web', value: '15%' },
  ]);

  addGridItem() {
    const newItem: GridItem = {
      title: 'New Item',
      subtitle: 'Added',
      icon: 'add',
      color: '#6b7280',
      cols: 1,
      rows: 1,
    };
    this.dynamicGridItems.update((items) => [...items, newItem]);
  }

  removeGridItem(index: number) {
    this.dynamicGridItems.update((items) => items.filter((_, i) => i !== index));
  }
}
