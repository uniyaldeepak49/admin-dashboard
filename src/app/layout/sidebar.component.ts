import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HasPermissionDirective } from '../shared/directives/has-permission.directive';
import { HasRoleDirective } from '../shared/directives/has-role.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, HasPermissionDirective, HasRoleDirective],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isOpen = input(false);
  navClick = output<void>();
  sidebarToggle = output<void>();

  isCollapsed = signal(false);

  onNavClick() {
    this.navClick.emit();
  }

  toggleSidebar() {
    this.isCollapsed.update((value) => !value);
    this.sidebarToggle.emit();
  }
}
