import { Directive, TemplateRef, ViewContainerRef, inject, OnInit, input } from '@angular/core';
import { AuthService, Permission } from '../../core/services/auth.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  hasPermission = input.required<Permission>();

  ngOnInit(): void {
    if (this.authService.hasPermission(this.hasPermission())) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
