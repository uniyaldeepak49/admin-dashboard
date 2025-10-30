import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

interface Country {
  value: string;
  viewValue: string;
  flag: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  singleSelectControl = new FormControl('');
  multiSelectControl = new FormControl([]);
  countryControl = new FormControl('');
  userControl = new FormControl([]);

  selectedValues = signal<string[]>([]);

  countries: Country[] = [
    { value: 'us', viewValue: 'United States', flag: '🇺🇸' },
    { value: 'ca', viewValue: 'Canada', flag: '🇨🇦' },
    { value: 'gb', viewValue: 'United Kingdom', flag: '🇬🇧' },
    { value: 'de', viewValue: 'Germany', flag: '🇩🇪' },
    { value: 'fr', viewValue: 'France', flag: '🇫🇷' },
    { value: 'jp', viewValue: 'Japan', flag: '🇯🇵' },
  ];

  users: User[] = [
    { id: 1, name: 'John Doe', role: 'Admin' },
    { id: 2, name: 'Jane Smith', role: 'Editor' },
    { id: 3, name: 'Mike Johnson', role: 'Viewer' },
    { id: 4, name: 'Sarah Wilson', role: 'Admin' },
    { id: 5, name: 'David Brown', role: 'Editor' },
  ];

  skills = ['Angular', 'React', 'Vue.js', 'Node.js', 'Python', 'Java', 'TypeScript'];
  categories = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Database', 'Testing'];
  priorities = ['Low', 'Medium', 'High', 'Critical'];

  onSelectionChange(values: string[]) {
    this.selectedValues.set(values);
  }

  clearSelection() {
    this.multiSelectControl.setValue([]);
    this.selectedValues.set([]);
  }
}
