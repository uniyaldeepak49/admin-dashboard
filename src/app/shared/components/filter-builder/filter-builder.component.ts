import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../data-table.component';

export interface FilterCondition {
  id: string;
  column: string;
  operator: string;
  value: any;
}

export interface FilterGroup {
  id: string;
  logic: 'AND' | 'OR';
  conditions: FilterCondition[];
  groups: FilterGroup[];
}

@Component({
  selector: 'app-filter-builder',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './filter-builder.component.html',
  styleUrl: './filter-builder.component.scss',
})
export class FilterBuilderComponent implements OnInit {
  columns = input<TableColumn[]>([]);
  filterChange = output<FilterGroup>();

  rootGroup = signal<FilterGroup>({
    id: 'root',
    logic: 'AND',
    conditions: [],
    groups: [],
  });

  ngOnInit(): void {
    // Add initial condition to make it more user-friendly
    this.addCondition(this.rootGroup());
  }

  operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'gt', label: 'Greater than' },
    { value: 'lt', label: 'Less than' },
    { value: 'gte', label: 'Greater or equal' },
    { value: 'lte', label: 'Less or equal' },
  ];

  addCondition(group: FilterGroup): void {
    const condition: FilterCondition = {
      id: this.generateId(),
      column: this.columns().length > 0 ? this.columns()[0].key : '',
      operator: 'equals',
      value: '',
    };
    group.conditions.push(condition);
    this.updateSignal();
    this.emitChange();
  }

  addGroup(parentGroup: FilterGroup): void {
    const newGroup: FilterGroup = {
      id: this.generateId(),
      logic: 'AND',
      conditions: [],
      groups: [],
    };
    parentGroup.groups.push(newGroup);
    this.emitChange();
  }

  removeCondition(group: FilterGroup, conditionId: string): void {
    group.conditions = group.conditions.filter((c) => c.id !== conditionId);
    this.updateSignal();
    this.emitChange();
  }

  removeGroup(parentGroup: FilterGroup, groupId: string): void {
    parentGroup.groups = parentGroup.groups.filter((g) => g.id !== groupId);
    this.emitChange();
  }

  onConditionChange(): void {
    this.updateSignal();
    this.emitChange();
  }

  onLogicChange(group: FilterGroup, logic: 'AND' | 'OR'): void {
    group.logic = logic;
    this.updateSignal();
    this.emitChange();
  }

  clear(): void {
    this.rootGroup.set({
      id: 'root',
      logic: 'AND',
      conditions: [],
      groups: [],
    });
    this.emitChange();
  }

  private emitChange(): void {
    this.filterChange.emit(this.rootGroup());
  }

  private updateSignal(): void {
    this.rootGroup.set({ ...this.rootGroup() });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
