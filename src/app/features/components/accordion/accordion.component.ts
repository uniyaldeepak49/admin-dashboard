import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule, MatIconModule, MatButtonModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  panelOpenState = signal(false);
  step = signal(0);

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update((current) => current + 1);
  }

  prevStep() {
    this.step.update((current) => current - 1);
  }
}
