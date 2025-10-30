import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Permission, UserRole } from '../../core/services/auth.service';

interface PermissionGroup {
  category: string;
  permissions: { key: Permission; label: string; description: string }[];
}

@Component({
  selector: 'app-user-permissions-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './user-permissions-dialog.component.html',
  styleUrls: ['./user-permissions-dialog.component.scss'],
})
export class UserPermissionsDialogComponent {
  private dialogRef = inject(MatDialogRef<UserPermissionsDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  selectedRole: UserRole = this.data.user.role || 'viewer';
  selectedPermissions: Permission[] = [...(this.data.user.permissions || [])];

  permissionGroups: PermissionGroup[] = [
    {
      category: 'Basic Operations',
      permissions: [
        { key: 'read', label: 'Read Access', description: 'View content and data' },
        { key: 'write', label: 'Write Access', description: 'Create and edit content' },
        { key: 'delete', label: 'Delete Access', description: 'Remove content and data' },
        { key: 'create', label: 'Create Access', description: 'Create new records' },
      ],
    },
    {
      category: 'User Management',
      permissions: [
        { key: 'manage-users', label: 'Manage Users', description: 'Full user management access' },
        { key: 'view-users', label: 'View Users', description: 'View user information' },
        { key: 'edit-users', label: 'Edit Users', description: 'Modify user details' },
        { key: 'delete-users', label: 'Delete Users', description: 'Remove user accounts' },
      ],
    },
    {
      category: 'Analytics & Reports',
      permissions: [
        {
          key: 'view-analytics',
          label: 'View Analytics',
          description: 'Access analytics dashboard',
        },
        { key: 'export-data', label: 'Export Data', description: 'Download reports and data' },
        {
          key: 'generate-reports',
          label: 'Generate Reports',
          description: 'Create custom reports',
        },
        { key: 'view-reports', label: 'View Reports', description: 'Access existing reports' },
      ],
    },
    {
      category: 'File Management',
      permissions: [
        { key: 'file-upload', label: 'Upload Files', description: 'Upload new files' },
        { key: 'file-download', label: 'Download Files', description: 'Download existing files' },
        { key: 'file-share', label: 'Share Files', description: 'Share files with others' },
        { key: 'file-delete', label: 'Delete Files', description: 'Remove files' },
        { key: 'file-manage', label: 'Manage Files', description: 'Full file management' },
      ],
    },
    {
      category: 'CRM Access',
      permissions: [
        { key: 'crm-view', label: 'View CRM', description: 'Access CRM dashboard' },
        { key: 'customer-create', label: 'Create Customers', description: 'Add new customers' },
        { key: 'customer-edit', label: 'Edit Customers', description: 'Modify customer data' },
        { key: 'lead-create', label: 'Create Leads', description: 'Add new leads' },
        { key: 'task-create', label: 'Create Tasks', description: 'Create new tasks' },
      ],
    },
  ];

  getRoleDescription(role: UserRole): string {
    switch (role) {
      case 'admin':
        return 'Full access to all features and settings';
      case 'editor':
        return 'Can create, edit, and manage content';
      case 'viewer':
        return 'Read-only access to most features';
      default:
        return '';
    }
  }

  onRoleChange(): void {
    // Set default permissions based on role
    switch (this.selectedRole) {
      case 'admin':
        this.selectedPermissions = this.getAllPermissions();
        break;
      case 'editor':
        this.selectedPermissions = this.getEditorPermissions();
        break;
      case 'viewer':
        this.selectedPermissions = this.getViewerPermissions();
        break;
    }
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.selectedPermissions.includes(permission);
  }

  togglePermission(permission: Permission, checked: boolean): void {
    if (checked) {
      if (!this.selectedPermissions.includes(permission)) {
        this.selectedPermissions.push(permission);
      }
    } else {
      this.selectedPermissions = this.selectedPermissions.filter((p) => p !== permission);
    }
  }

  removePermission(permission: Permission): void {
    this.selectedPermissions = this.selectedPermissions.filter((p) => p !== permission);
  }

  getPermissionLabel(permission: Permission): string {
    for (const group of this.permissionGroups) {
      const found = group.permissions.find((p) => p.key === permission);
      if (found) return found.label;
    }
    return permission;
  }

  private getAllPermissions(): Permission[] {
    return this.permissionGroups.flatMap((group) => group.permissions.map((p) => p.key));
  }

  private getEditorPermissions(): Permission[] {
    return [
      'read',
      'write',
      'create',
      'view-users',
      'view-analytics',
      'export-data',
      'view-reports',
      'file-upload',
      'file-download',
      'file-share',
      'crm-view',
      'customer-create',
      'customer-edit',
      'lead-create',
      'task-create',
    ];
  }

  private getViewerPermissions(): Permission[] {
    return ['read', 'view-analytics', 'file-download', 'crm-view'];
  }

  save(): void {
    this.dialogRef.close({
      role: this.selectedRole,
      permissions: this.selectedPermissions,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
