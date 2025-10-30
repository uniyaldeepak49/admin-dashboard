import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
  QuickFilter,
} from '../../shared/components/data-table.component';
import { UsersService } from '../../core/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPermissionsDialogComponent } from './user-permissions-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    MatToolbarModule,
    MatListModule,
    DataTableComponent,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  users = this.usersService.getUsers;
  pageIndex = signal(0);
  pageSize = signal(5);

  userStats = computed(() => {
    const allUsers = this.users();
    const total = allUsers.length;
    if (total === 0)
      return {
        total: 0,
        active: 0,
        inactive: 0,
        admin: 0,
        editor: 0,
        viewer: 0,
        activePercentage: 0,
      };

    let active = 0,
      inactive = 0,
      admin = 0,
      editor = 0,
      viewer = 0;

    for (const user of allUsers) {
      if (user.status === 'Active') active++;
      else inactive++;

      switch (user.role) {
        case 'Admin':
          admin++;
          break;
        case 'Editor':
          editor++;
          break;
        case 'Viewer':
          viewer++;
          break;
      }
    }

    return {
      total,
      active,
      inactive,
      admin,
      editor,
      viewer,
      activePercentage: Math.round((active / total) * 100),
    };
  });

  recentActivity = signal(this.getRecentActivityData());

  private getRecentActivityData() {
    return [
      { user: 'John Doe', action: 'Login', time: '2h ago', type: 'success' as const },
      { user: 'Jane Smith', action: 'Profile Updated', time: '4h ago', type: 'info' as const },
      { user: 'Bob Wilson', action: 'Password Reset', time: '6h ago', type: 'warning' as const },
      {
        user: 'Alice Johnson',
        action: 'Account Created',
        time: '1d ago',
        type: 'success' as const,
      },
    ];
  }

  quickFilters: QuickFilter[] = [
    {
      key: 'today',
      label: 'Today',
      icon: 'today',
      filterFn: (data) =>
        data.filter((item) => {
          const itemDate = new Date(item.createdDate);
          const today = new Date();
          return itemDate.toDateString() === today.toDateString();
        }),
    },
    {
      key: 'thisWeek',
      label: 'This Week',
      icon: 'date_range',
      filterFn: (data) =>
        data.filter((item) => {
          const itemDate = new Date(item.createdDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return itemDate >= weekAgo;
        }),
    },
    {
      key: 'active',
      label: 'Active Only',
      icon: 'check_circle',
      filterFn: (data) => data.filter((item) => item.status === 'active'),
    },
  ];

  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  actions: TableAction[] = [
    { icon: 'edit', label: 'Edit user', action: 'edit' },
    { icon: 'security', label: 'Assign Permissions', action: 'permissions' },
    { icon: 'delete', label: 'Delete user', action: 'delete' },
  ];

  onTableAction(event: { action: string; row: unknown }) {
    if (event.action && this.hasId(event.row)) {
      switch (event.action) {
        case 'edit':
          this.editUser(event.row);
          break;
        case 'permissions':
          this.assignPermissions(event.row);
          break;
        case 'delete':
          this.deleteUser(event.row);
          break;
      }
    }
  }

  private editUser(user: { id: string }): void {
    this.snackBar.open(`Edit user ${user.id}`, 'Close', { duration: 3000 });
  }

  private assignPermissions(user: any): void {
    const dialogRef = this.dialog.open(UserPermissionsDialogComponent, {
      width: '700px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update user permissions
        this.snackBar.open(`Permissions updated for ${user.name}`, 'Close', { duration: 3000 });
      }
    });
  }

  private deleteUser(user: { id: string }): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.snackBar.open(`User ${user.id} deleted`, 'Close', { duration: 3000 });
    }
  }

  private hasId(obj: unknown): obj is { id: string } {
    return typeof obj === 'object' && obj !== null && 'id' in obj;
  }

  onSelectionChange(selected: unknown[]) {
    if (selected?.length > 0) {
      return;
    }
  }
}
