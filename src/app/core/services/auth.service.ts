import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'admin' | 'editor' | 'viewer';

export type Permission =
  // Basic CRUD
  | 'read'
  | 'write'
  | 'delete'
  | 'create'
  // User Management
  | 'manage-users'
  | 'view-users'
  | 'edit-users'
  | 'delete-users'
  // Analytics & Reports
  | 'view-analytics'
  | 'export-data'
  | 'generate-reports'
  | 'view-reports'
  // System Administration
  | 'system-logs'
  | 'user-manual'
  | 'system-settings'
  // Business Features
  | 'products'
  | 'reports'
  | 'orders'
  | 'inventory'
  | 'revenue'
  | 'conversion'
  // Dashboard & Profile
  | 'dashboard'
  | 'profile'
  | 'settings'
  // File Management
  | 'file-upload'
  | 'file-download'
  | 'file-share'
  | 'file-delete'
  | 'file-manage'
  // CRM Permissions
  | 'crm-view'
  | 'crm-customers'
  | 'crm-leads'
  | 'crm-tasks'
  | 'crm-calendar'
  | 'customer-create'
  | 'customer-edit'
  | 'customer-delete'
  | 'customer-view'
  | 'lead-create'
  | 'lead-edit'
  | 'lead-delete'
  | 'lead-convert'
  | 'task-create'
  | 'task-edit'
  | 'task-complete'
  | 'task-assign'
  | 'appointment-create'
  | 'appointment-edit'
  | 'appointment-cancel'
  // Email & Notifications
  | 'email-compose'
  | 'email-send'
  | 'email-delete'
  | 'email-inbox'
  | 'notifications-manage'
  | 'notifications-view'
  // Pages Access
  | 'pages-access'
  | 'signin-page'
  | 'change-password'
  | 'forgot-password'
  | 'user-profile-page'
  | 'timeline-page'
  | 'not-found-page'
  // Components Access
  | 'components-view'
  | 'forms-access'
  | 'alerts-access'
  | 'cards-access'
  | 'tables-access'
  | 'buttons-access'
  | 'loaders-access'
  | 'accordion-access'
  | 'autocomplete-access'
  | 'chips-access'
  | 'select-access'
  | 'multiselect-tree-access'
  | 'calendar-access'
  | 'file-uploads-access'
  | 'drag-drop-access'
  | 'grids-access'
  | 'modal-popup-access'
  | 'headers-access'
  | 'footers-access'
  | 'sliders-access'
  | 'carousel-sliders-access'
  | 'gallery-access'
  | 'portfolio-access'
  | 'editors-access';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

const DUMMY_USERS: AuthUser[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    permissions: [
      // Full access to everything
      'read',
      'write',
      'delete',
      'create',
      'manage-users',
      'view-users',
      'edit-users',
      'delete-users',
      'view-analytics',
      'export-data',
      'generate-reports',
      'view-reports',
      'system-logs',
      'user-manual',
      'system-settings',
      'products',
      'reports',
      'orders',
      'inventory',
      'revenue',
      'conversion',
      'dashboard',
      'profile',
      'settings',
      'file-upload',
      'file-download',
      'file-share',
      'file-delete',
      'file-manage',
      'crm-view',
      'crm-customers',
      'crm-leads',
      'crm-tasks',
      'crm-calendar',
      'customer-create',
      'customer-edit',
      'customer-delete',
      'customer-view',
      'lead-create',
      'lead-edit',
      'lead-delete',
      'lead-convert',
      'task-create',
      'task-edit',
      'task-complete',
      'task-assign',
      'appointment-create',
      'appointment-edit',
      'appointment-cancel',
      'email-compose',
      'email-send',
      'email-delete',
      'email-inbox',
      'notifications-manage',
      'notifications-view',
      'pages-access',
      'signin-page',
      'change-password',
      'forgot-password',
      'user-profile-page',
      'timeline-page',
      'not-found-page',
      'components-view',
      'forms-access',
      'alerts-access',
      'cards-access',
      'tables-access',
      'buttons-access',
      'loaders-access',
      'accordion-access',
      'autocomplete-access',
      'chips-access',
      'select-access',
      'multiselect-tree-access',
      'calendar-access',
      'file-uploads-access',
      'drag-drop-access',
      'grids-access',
      'modal-popup-access',
      'headers-access',
      'footers-access',
      'sliders-access',
      'carousel-sliders-access',
      'gallery-access',
      'portfolio-access',
      'editors-access',
    ],
  },
  {
    id: '2',
    email: 'editor@company.com',
    name: 'Editor User',
    role: 'editor',
    permissions: [
      // Business operations access (no admin-only features)
      'read',
      'write',
      'create',
      'view-users',
      'view-analytics',
      'export-data',
      'generate-reports',
      'view-reports',
      'products',
      'reports',
      'orders',
      'inventory',
      'revenue',
      'conversion',
      'dashboard',
      'profile',
      'settings',
      'file-upload',
      'file-download',
      'file-share',
      'file-manage',
      'crm-view',
      'crm-customers',
      'crm-leads',
      'crm-tasks',
      'customer-create',
      'customer-edit',
      'customer-view',
      'lead-create',
      'lead-edit',
      'lead-convert',
      'task-create',
      'task-edit',
      'task-complete',
      'appointment-create',
      'appointment-edit',
      'email-compose',
      'email-send',
      'email-inbox',
      'notifications-view',
      'pages-access',
      'signin-page',
      'change-password',
      'forgot-password',
      'user-profile-page',
      'timeline-page',
      'not-found-page',
      'components-view',
      'forms-access',
      'alerts-access',
      'cards-access',
      'tables-access',
      'buttons-access',
      'loaders-access',
      'accordion-access',
      'autocomplete-access',
      'chips-access',
      'select-access',
      'multiselect-tree-access',
      'calendar-access',
      'file-uploads-access',
      'drag-drop-access',
      'grids-access',
      'modal-popup-access',
      'headers-access',
      'footers-access',
      'sliders-access',
      'carousel-sliders-access',
      'gallery-access',
      'portfolio-access',
      'editors-access',
    ],
  },
  {
    id: '3',
    email: 'viewer@company.com',
    name: 'Viewer User',
    role: 'viewer',
    permissions: [
      // Read-only access (no write/edit/delete permissions)
      'read',
      'dashboard',
      'profile',
      'view-analytics',
      'view-reports',
      'file-download',
      'crm-view',
      'customer-view',
      'notifications-view',
      'pages-access',
      'signin-page',
      'change-password',
      'forgot-password',
      'user-profile-page',
      'timeline-page',
      'not-found-page',
      'components-view',
      'alerts-access',
      'cards-access',
      'tables-access',
      'buttons-access',
      'loaders-access',
      'accordion-access',
      'autocomplete-access',
      'chips-access',
      'select-access',
      'multiselect-tree-access',
      'calendar-access',
      'grids-access',
      'headers-access',
      'footers-access',
      'sliders-access',
      'carousel-sliders-access',
      'gallery-access',
      'portfolio-access',
    ],
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  private currentUser = signal<AuthUser | null>(null);
  private isAuthenticated = signal(false);

  user = this.currentUser.asReadonly();
  authenticated = this.isAuthenticated.asReadonly();

  userRole = computed(() => this.currentUser()?.role || null);
  userPermissions = computed(() => this.currentUser()?.permissions || []);

  constructor() {
    this.loadUserFromStorage();
  }

  login(email: string, password: string, rememberMe: boolean = false): boolean {
    const user = this.authenticateUser(email, password);

    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);

      try {
        if (rememberMe) {
          localStorage.setItem('auth-user', JSON.stringify(user));
          localStorage.setItem('remember-me', 'true');
        } else {
          sessionStorage.setItem('auth-user', JSON.stringify(user));
          localStorage.removeItem('remember-me');
        }
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }

      this.router.navigate(['/dashboard']);
      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    try {
      localStorage.removeItem('auth-user');
      sessionStorage.removeItem('auth-user');
      localStorage.removeItem('remember-me');
    } catch (error) {
      console.error('Error clearing storage during logout:', error);
    }

    this.router.navigate(['/login']);
  }

  hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }

  hasPermission(permission: Permission): boolean {
    return this.userPermissions().includes(permission);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.userRole();
    return currentRole ? roles.includes(currentRole) : false;
  }

  private loadUserFromStorage(): void {
    try {
      // Check localStorage first (remember me)
      let stored = localStorage.getItem('auth-user');

      // If not found, check sessionStorage (current session)
      if (!stored) {
        stored = sessionStorage.getItem('auth-user');
      }

      if (stored) {
        const user = JSON.parse(stored) as AuthUser;
        // Validate user object structure
        if (user && user.id && user.email && user.role) {
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        } else {
          // Clear invalid data
          this.clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.clearStoredAuth();
    }
  }

  private clearStoredAuth(): void {
    try {
      localStorage.removeItem('auth-user');
      sessionStorage.removeItem('auth-user');
      localStorage.removeItem('remember-me');
    } catch (error) {
      console.error('Error clearing stored auth data:', error);
    }
  }

  private authenticateUser(email: string, password: string): AuthUser | null {
    if (password === 'password123') {
      return DUMMY_USERS.find((user) => user.email === email) || null;
    }
    return null;
  }
}
