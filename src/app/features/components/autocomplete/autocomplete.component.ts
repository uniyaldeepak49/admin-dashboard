import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class AutocompleteComponent {
  countryControl = new FormControl('');
  userControl = new FormControl('');
  skillControl = new FormControl('');

  countries: Country[] = [
    { name: 'United States', code: 'US', flag: '🇺🇸' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪' },
    { name: 'France', code: 'FR', flag: '🇫🇷' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  ];

  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW' },
  ];

  skills = ['Angular', 'React', 'Vue.js', 'Node.js', 'Python', 'Java', 'TypeScript'];
  selectedSkills = signal<string[]>([]);

  filteredCountries = computed(() => {
    const filterValue = this.countryControl.value?.toLowerCase() || '';
    return this.countries.filter((country) => country.name.toLowerCase().includes(filterValue));
  });

  filteredUsers = computed(() => {
    const filterValue = this.userControl.value?.toLowerCase() || '';
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(filterValue) ||
        user.email.toLowerCase().includes(filterValue),
    );
  });

  filteredSkills = computed(() => {
    const filterValue = this.skillControl.value?.toLowerCase() || '';
    return this.skills.filter(
      (skill) =>
        skill.toLowerCase().includes(filterValue) && !this.selectedSkills().includes(skill),
    );
  });

  addSkill(skill: string) {
    this.selectedSkills.update((skills) => [...skills, skill]);
    this.skillControl.setValue('');
  }

  removeSkill(skill: string) {
    this.selectedSkills.update((skills) => skills.filter((s) => s !== skill));
  }

  displayCountry(country: Country): string {
    return country ? `${country.flag} ${country.name}` : '';
  }

  displayUser(user: User): string {
    return user ? user.name : '';
  }
}
