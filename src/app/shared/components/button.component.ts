import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  variant = input<'primary' | 'accent' | 'warn'>('primary');
  disabled = input(false);
  type = input<'button' | 'submit'>('button');
  ariaLabel = input<string>();
}
