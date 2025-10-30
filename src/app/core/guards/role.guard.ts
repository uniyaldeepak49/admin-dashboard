import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as UserRole[];

  if (!authService.authenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
