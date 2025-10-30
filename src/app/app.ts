import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { PwaService } from './core/services/pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  private themeService = inject(ThemeService);
  private pwaService = inject(PwaService);
}
