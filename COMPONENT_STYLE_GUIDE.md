# Angular Admin Dashboard - Component Style Guide

## Table of Contents

1. [General Guidelines](#general-guidelines)
2. [Shared Components](#shared-components)
3. [Feature Components](#feature-components)
4. [Layout Components](#layout-components)
5. [Best Practices](#best-practices)
6. [Code Examples](#code-examples)

---

## General Guidelines

### Angular 20 Standards

- ✅ Use **standalone components** with `standalone: true`
- ✅ Use **inject()** function instead of constructor injection
- ✅ Use **input()** and **output()** functions instead of decorators
- ✅ Use **signal()** for reactive state management
- ✅ Use **computed()** for derived state
- ✅ Separate HTML and SCSS files (no inline templates/styles)

### File Structure

```
component-name/
├── component-name.component.ts
├── component-name.component.html
└── component-name.component.scss
```

### Naming Conventions

- **Components**: PascalCase (e.g., `DataTableComponent`)
- **Files**: kebab-case (e.g., `data-table.component.ts`)
- **Selectors**: kebab-case with `app-` prefix (e.g., `app-data-table`)

---

## Shared Components

### 1. Data Table Component

**Location**: `src/app/shared/components/data-table.component.ts`

#### Usage

```typescript
<app-data-table
  [data]="users()"
  [columns]="columns()"
  [actions]="actions()"
  [showSelection]="true"
  [showPagination]="true"
  [showGlobalSearch]="true"
  [(pageIndex)]="pageIndex"
  [(pageSize)]="pageSize"
  (actionClick)="onActionClick($event)"
  (selectionChange)="onSelectionChange($event)">
</app-data-table>
```

#### Configuration

```typescript
columns = signal<TableColumn[]>([
  { key: 'name', label: 'Name', sortable: true, filterable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'actions', label: 'Actions', type: 'actions' },
]);

actions = signal<TableAction[]>([
  { icon: 'edit', label: 'Edit', action: 'edit' },
  { icon: 'delete', label: 'Delete', action: 'delete' },
]);
```

### 2. Button Component

**Location**: `src/app/shared/components/button.component.ts`

#### Usage

```typescript
<app-button
  [variant]="'primary'"
  [disabled]="false"
  [type]="'button'"
  [ariaLabel]="'Save changes'">
  Save
</app-button>
```

### 3. Card Component

**Location**: `src/app/shared/components/card.component.ts`

#### Usage

```typescript
<app-card [title]="'Dashboard Stats'">
  <p>Card content goes here</p>
</app-card>
```

### 4. Loader Component

**Location**: `src/app/shared/components/loader.component.ts`

#### Usage

```typescript
<app-loader></app-loader>
```

### 5. Footer Component

**Location**: `src/app/shared/components/footer/footer.component.ts`

#### Usage

```typescript
<app-footer></app-footer>
```

---

## Feature Components

### 1. Buttons Component

**Location**: `src/app/features/components/buttons/buttons.component.ts`

#### Key Features

- Material Design button variants
- Loading states with spinners
- Icon buttons with tooltips
- Button toggles and badges

#### Usage Pattern

```typescript
@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent {
  isLoading = signal(false);

  simulateLoading() {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 2000);
  }
}
```

### 2. Cards Component

**Location**: `src/app/features/components/cards/cards.component.ts`

#### Key Features

- Product cards with ratings
- Team member cards with status
- Statistics cards with trends
- Project progress cards

#### Data Structure

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}
```

### 3. Forms Component

**Location**: `src/app/features/components/forms/forms.component.ts`

#### Key Features

- Reactive forms with validation
- Material Design form fields
- File upload components
- Date pickers and selects

### 4. Tables Component

**Location**: `src/app/features/components/tables/tables.component.ts`

#### Key Features

- Advanced data tables
- Sorting and filtering
- Pagination and virtual scrolling
- Export functionality

---

## Layout Components

### 1. Header Component

**Location**: `src/app/layout/header.component.ts`

#### Key Features

- User profile dropdown
- Notifications panel
- Theme toggle
- Search functionality

### 2. Sidebar Component

**Location**: `src/app/layout/sidebar.component.ts`

#### Key Features

- Collapsible navigation
- Role-based menu items
- Active route highlighting
- Mobile responsive

### 3. Layout Component

**Location**: `src/app/layout/layout.component.ts`

#### Key Features

- Main application layout
- Responsive design
- Theme support
- PWA integration

---

## Best Practices

### 1. Component Structure

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
})
export class ExampleComponent implements OnInit {
  // Services
  private service = inject(ServiceName);

  // Inputs
  data = input<DataType[]>([]);
  config = input<ConfigType>();

  // Outputs
  actionClick = output<ActionEvent>();

  // Signals
  loading = signal(false);
  items = signal<ItemType[]>([]);

  // Computed
  filteredItems = computed(() => this.items().filter((item) => item.active));

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Implementation
  }
}
```

### 2. Template Patterns

```html
<!-- Loading State -->
@if (loading()) {
<app-loader></app-loader>
} @else {
<!-- Content -->
}

<!-- Conditional Rendering -->
@if (hasPermission('VIEW_USERS')) {
<button mat-button>View Users</button>
}

<!-- Loops -->
@for (item of items(); track item.id) {
<div>{{ item.name }}</div>
}

<!-- Error Handling -->
@if (error()) {
<mat-error>{{ error() }}</mat-error>
}
```

### 3. Styling Patterns

```scss
.component-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

### 4. Permission Integration

```typescript
// In component
hasRole = inject(AuthService).hasRole;
hasPermission = inject(AuthService).hasPermission;

// In template
@if (hasRole('ADMIN')) {
  <button mat-button>Admin Action</button>
}

@if (hasPermission('DELETE_USER')) {
  <button mat-icon-button color="warn">
    <mat-icon>delete</mat-icon>
  </button>
}
```

---

## Code Examples

### 1. Creating a New Feature Component

```typescript
// new-feature.component.ts
import { Component, signal, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-feature',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './new-feature.component.html',
  styleUrl: './new-feature.component.scss',
})
export class NewFeatureComponent {
  // Inputs
  title = input<string>('Default Title');
  data = input<any[]>([]);

  // Outputs
  itemClick = output<any>();

  // State
  loading = signal(false);
  selectedItem = signal<any>(null);

  onItemClick(item: any): void {
    this.selectedItem.set(item);
    this.itemClick.emit(item);
  }
}
```

### 2. Using Shared Components

```typescript
// page.component.ts
import { DataTableComponent } from '@shared/components/data-table.component';
import { ButtonComponent } from '@shared/components/button.component';
import { CardComponent } from '@shared/components/card.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [DataTableComponent, ButtonComponent, CardComponent],
  template: `
    <app-card [title]="'Users Management'">
      <app-data-table
        [data]="users()"
        [columns]="columns()"
        [showSelection]="true"
        (actionClick)="onUserAction($event)"
      >
      </app-data-table>

      <app-button [variant]="'primary'" (click)="addUser()"> Add User </app-button>
    </app-card>
  `,
})
export class PageComponent {
  users = signal<User[]>([]);
  columns = signal<TableColumn[]>([
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
  ]);
}
```

### 3. Mobile Responsive Patterns

```scss
.responsive-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

.mobile-hidden {
  @media (max-width: 768px) {
    display: none;
  }
}

.mobile-only {
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
}
```

---

## Quick Reference

### Component Checklist

- [ ] Standalone component with proper imports
- [ ] Uses inject() for services
- [ ] Uses input()/output() for props
- [ ] Uses signal() for state
- [ ] Separate HTML/SCSS files
- [ ] Mobile responsive design
- [ ] Permission-based access control
- [ ] Error handling
- [ ] Loading states
- [ ] Proper TypeScript types

### Import Patterns

```typescript
// Always include
import { Component, signal, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material modules as needed
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Shared components
import { DataTableComponent } from '@shared/components/data-table.component';
```

This style guide ensures consistency across your Angular 20 admin dashboard and provides clear patterns for creating new components and pages.
