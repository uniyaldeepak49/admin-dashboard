import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { QuickFilter, ExportFormat } from '../data-table.component';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.scss',
})
export class TableToolbarComponent {
  quickFilters = input<QuickFilter[]>([]);
  activeQuickFilter = input<string | null>(null);
  sortColumns = input<any[]>([]);
  multiSort = input(false);
  showGrouping = input(false);
  groupBy = input<string>('');
  hierarchical = input(false);
  showExport = input(false);
  exportFormats = input<ExportFormat[]>([]);

  quickFilterClick = output<string>();
  clearAllFilters = output<void>();
  clearSort = output<void>();
  expandAllGroups = output<void>();
  collapseAllGroups = output<void>();
  expandAllNodes = output<void>();
  collapseAllNodes = output<void>();
  exportData = output<ExportFormat>();
}
