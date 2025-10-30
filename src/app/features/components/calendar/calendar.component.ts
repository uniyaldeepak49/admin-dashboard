import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  singleDateControl = new FormControl(new Date());
  startDateControl = new FormControl<Date | null>(null);
  endDateControl = new FormControl<Date | null>(null);

  selectedDates = signal<Date[]>([]);
  minDate = new Date(2020, 0, 1);
  maxDate = new Date(2030, 11, 31);

  onDateSelected(date: Date | null) {
    if (date) {
      this.selectedDates.update((dates) => [...dates, date]);
    }
  }

  clearSelectedDates() {
    this.selectedDates.set([]);
  }

  removeDate(dateToRemove: Date) {
    this.selectedDates.update((dates) =>
      dates.filter((date) => date.getTime() !== dateToRemove.getTime()),
    );
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    return day !== 0 && day !== 6; // Disable weekends
  };
}
