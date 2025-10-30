import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
})
export class ChipsComponent {
  tags = signal(['Angular', 'TypeScript', 'Material']);
  users = signal(['John Doe', 'Jane Smith', 'Mike Johnson']);
  categories = signal(['Frontend', 'Backend', 'DevOps']);

  newTagControl = new FormControl('');
  newUserControl = new FormControl('');

  addTag() {
    const value = this.newTagControl.value?.trim();
    if (value) {
      this.tags.update((tags) => [...tags, value]);
      this.newTagControl.setValue('');
    }
  }

  removeTag(tag: string) {
    this.tags.update((tags) => tags.filter((t) => t !== tag));
  }

  addUser() {
    const value = this.newUserControl.value?.trim();
    if (value) {
      this.users.update((users) => [...users, value]);
      this.newUserControl.setValue('');
    }
  }

  removeUser(user: string) {
    this.users.update((users) => users.filter((u) => u !== user));
  }

  removeCategory(category: string) {
    this.categories.update((categories) => categories.filter((c) => c !== category));
  }
}
