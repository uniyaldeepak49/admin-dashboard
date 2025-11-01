import { Directive, input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService, Permission } from '../../core/services/auth.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  hasPermission = input.required<Permission | Permission[]>();

  constructor() {
    effect(() => {
      try {
        const permissionInput = this.hasPermission();
        const permissions: Permission[] = Array.isArray(permissionInput)
          ? permissionInput
          : [permissionInput];

        const hasAnyPermission = permissions.some((permission) =>
          this.authService.hasPermission(permission),
        );

        if (hasAnyPermission) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      } catch (error) {
        console.error('Error in hasPermission directive:', error);
        this.viewContainer.clear();
      }
    });
  }
}
