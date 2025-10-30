import { Directive, input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService, UserRole } from '../../core/services/auth.service';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  hasRole = input.required<UserRole | UserRole[]>();

  constructor() {
    effect(() => {
      try {
        const roleInput = this.hasRole();
        const roles: UserRole[] = Array.isArray(roleInput) ? roleInput : [roleInput];

        if (this.authService.hasAnyRole(roles)) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      } catch (error) {
        console.error('Error in hasRole directive:', error);
        this.viewContainer.clear();
      }
    });
  }
}
