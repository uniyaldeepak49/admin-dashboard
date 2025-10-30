import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.authenticated()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.authenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const userRole = authService.userRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
};
