import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
  ],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent {
  users = signal<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
      status: 'active',
      lastLogin: '2024-01-14',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Viewer',
      status: 'inactive',
      lastLogin: '2024-01-10',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15',
    },
  ]);

  displayedColumns = ['select', 'name', 'email', 'role', 'status', 'lastLogin', 'actions'];
  selectedUsers = signal<number[]>([]);

  filteredUsers = computed(() => this.users());

  toggleUser(userId: number) {
    this.selectedUsers.update((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId],
    );
  }

  toggleAll() {
    const allSelected = this.selectedUsers().length === this.users().length;
    this.selectedUsers.set(allSelected ? [] : this.users().map((u) => u.id));
  }

  deleteUser(id: number) {
    this.users.update((current) => current.filter((u) => u.id !== id));
  }

  editUser(user: User) {
    console.log('Edit user:', user);
  }
}
