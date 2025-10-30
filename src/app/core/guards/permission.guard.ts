import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Permission } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermission = route.data?.['permission'] as Permission;

  if (!authService.authenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
