import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-headers',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatChipsModule,
  ],
  templateUrl: './headers.component.html',
  styleUrl: './headers.component.scss',
})
export class HeadersComponent {
  notificationCount = signal(5);

  breadcrumbs = signal([
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Components', link: '/dashboard/components' },
    { label: 'Headers', link: null },
  ]);

  menuItems = signal([
    { icon: 'person', label: 'Profile' },
    { icon: 'settings', label: 'Settings' },
    { icon: 'help', label: 'Help' },
    { icon: 'logout', label: 'Logout' },
  ]);
}
