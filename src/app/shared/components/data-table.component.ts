import { Component, input, output, computed, signal, model, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataCacheService, RefreshStrategy } from '../services/data-cache.service';
import { OfflineService } from '../services/offline.service';
import { FilterBuilderComponent, FilterGroup } from './filter-builder/filter-builder.component';
import { TableToolbarComponent } from './table-toolbar/table-toolbar.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'actions';
  filterable?: boolean;
  filterType?: 'text' | 'number-range' | 'date-range' | 'dropdown';
  filterOptions?: string[];
  sortFn?: (a: any, b: any) => number;
}

export interface ColumnFilter {
  key: string;
  type: 'text' | 'number-range' | 'date-range' | 'dropdown';
  value?: any;
  min?: number;
  max?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface TableAction {
  icon: string;
  label: string;
  action: string;
}

export interface BulkAction {
  icon: string;
  label: string;
  action: string;
  color?: 'primary' | 'accent' | 'warn';
}

export interface RowMenuAction {
  icon: string;
  label: string;
  action: string;
  color?: 'primary' | 'accent' | 'warn';
  divider?: boolean;
}

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export interface QuickFilter {
  key: string;
  label: string;
  icon?: string;
  filterFn: (data: any[]) => any[];
}

export interface SortColumn {
  key: string;
  direction: 'asc' | 'desc';
  priority: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatPaginatorModule,
    ScrollingModule,
    DragDropModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FilterBuilderComponent,
    TableToolbarComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent implements OnInit {
  private cacheService = inject(DataCacheService);
  private offlineService = inject(OfflineService);

  isOnline = this.offlineService.isOnline;
  data = input<any[]>([]);
  columns = input<TableColumn[]>([]);
  actions = input<TableAction[]>([]);
  bulkActions = input<BulkAction[]>([]);
  showRowMenu = input(false);
  rowMenuActions = input<RowMenuAction[]>([]);
  enableDragDrop = input(false);
  showExport = input(false);
  exportFormats = input<ExportFormat[]>(['csv', 'json']);
  loading = input(false);
  loadingRows = input(5);

  rowReorder = output<{ previousIndex: number; currentIndex: number; data: any[] }>();
  showSelection = input(false);
  showPagination = input(true);
  virtualScrolling = input(false);
  itemSize = input(48);
  cacheKey = input<string>('');
  cacheTtl = input(300000);
  refreshStrategy = input<RefreshStrategy>('time-based');
  dataLoader = input<() => Promise<any[]>>();
  showGlobalSearch = input(false);
  showColumnFilters = input(false);
  showAdvancedFilter = input(false);
  showQuickFilters = input(false);
  quickFilters = input<QuickFilter[]>([]);

  cachedData = signal<any[]>([]);
  globalSearchTerm = signal('');
  columnFilters = signal<Map<string, ColumnFilter>>(new Map());
  advancedFilter = signal<FilterGroup | null>(null);
  activeQuickFilter = signal<string | null>(null);

  actionClick = output<{ action: string; row: any }>();
  selectionChange = output<any[]>();
  bulkActionClick = output<{ action: string; rows: any[] }>();

  selection = new SelectionModel<any>(true, []);
  pageIndex = model.required<number>();
  pageSize = model.required<number>();
  sortColumns = signal<SortColumn[]>([]);
  multiSort = input(false);
  groupBy = input<string>('');
  showGrouping = input(false);
  hierarchical = input(false);
  parentKey = input<string>('parentId');
  childrenKey = input<string>('children');

  expandedGroups = signal<Set<string>>(new Set());
  expandedNodes = signal<Set<string>>(new Set());

  refreshCache(): void {
    if (this.cacheKey()) {
      if (this.isOnline()) {
        this.cacheService.invalidate(this.cacheKey());
        this.loadCachedData();
      }
    }
  }

  displayData = computed(() => {
    if (this.loading()) return [];
    const dataSource = this.cachedData().length > 0 ? this.cachedData() : this.data();
    const sorted = this.getSortedData(dataSource);
    const grouped = this.getGroupedData(sorted);
    return this.virtualScrolling() ? grouped : this.getPaginatedData(grouped);
  });

  Array = Array;

  ngOnInit(): void {
    if (this.cacheKey() && this.dataLoader()) {
      this.loadCachedData();
    }
  }

  private loadCachedData(): void {
    const cached = this.cacheService.get(
      this.cacheKey(),
      this.dataLoader(),
      this.refreshStrategy(),
      !this.isOnline(),
    );
    if (cached) {
      this.cachedData.set(cached);
    }
  }

  private getSortedData(data: any[]): any[] {
    let filteredData = this.getFilteredData(data);
    const sortColumns = this.sortColumns();
    if (sortColumns.length === 0) return filteredData;

    return filteredData.sort((a, b) => {
      for (const sortCol of sortColumns.sort((x, y) => x.priority - y.priority)) {
        const column = this.columns().find((c) => c.key === sortCol.key);
        let result = 0;

        if (column?.sortFn) {
          result = column.sortFn(a, b);
        } else {
          result = this.getDefaultSortResult(a[sortCol.key], b[sortCol.key], column?.type);
        }

        if (result !== 0) {
          return sortCol.direction === 'asc' ? result : -result;
        }
      }
      return 0;
    });
  }

  private getFilteredData(data: any[]): any[] {
    let filteredData = this.applyQuickFilter(data);
    filteredData = this.applyGlobalSearch(filteredData);
    filteredData = this.applyColumnFilters(filteredData);
    return this.applyAdvancedFilter(filteredData);
  }

  private applyGlobalSearch(data: any[]): any[] {
    const searchTerm = this.globalSearchTerm().toLowerCase().trim();
    if (!searchTerm) return data;

    return data.filter((row) =>
      this.columns().some((column) => {
        const value = row[column.key];
        return value?.toString().toLowerCase().includes(searchTerm);
      }),
    );
  }

  private applyColumnFilters(data: any[]): any[] {
    const filters = this.columnFilters();
    if (filters.size === 0) return data;

    return data.filter((row) => {
      return Array.from(filters.values()).every((filter) => {
        const value = row[filter.key];

        switch (filter.type) {
          case 'text':
            return (
              !filter.value || value?.toString().toLowerCase().includes(filter.value.toLowerCase())
            );
          case 'number-range':
            const numValue = Number(value);
            return (
              (!filter.min || numValue >= filter.min) && (!filter.max || numValue <= filter.max)
            );
          case 'date-range':
            const dateValue = new Date(value);
            return (
              (!filter.startDate || dateValue >= filter.startDate) &&
              (!filter.endDate || dateValue <= filter.endDate)
            );
          case 'dropdown':
            return !filter.value || value === filter.value;
          default:
            return true;
        }
      });
    });
  }

  onGlobalSearch(term: string): void {
    this.globalSearchTerm.set(term);
  }

  clearGlobalSearch(): void {
    this.globalSearchTerm.set('');
  }

  onColumnFilter(columnKey: string, filterType: string, value: any): void {
    const filters = new Map(this.columnFilters());

    if (!value || (typeof value === 'string' && !value.trim())) {
      filters.delete(columnKey);
    } else {
      const filter: ColumnFilter = { key: columnKey, type: filterType as any };

      switch (filterType) {
        case 'text':
        case 'dropdown':
          filter.value = value;
          break;
        case 'number-range':
          filter.min = value.min;
          filter.max = value.max;
          break;
        case 'date-range':
          filter.startDate = value.startDate;
          filter.endDate = value.endDate;
          break;
      }

      filters.set(columnKey, filter);
    }

    this.columnFilters.set(filters);
  }

  clearColumnFilters(): void {
    this.columnFilters.set(new Map());
  }

  onAdvancedFilterChange(filter: FilterGroup): void {
    this.advancedFilter.set(filter);
  }

  private applyAdvancedFilter(data: any[]): any[] {
    const filter = this.advancedFilter();
    if (!filter || (!filter.conditions?.length && !filter.groups?.length)) return data;

    return data.filter((row) => this.evaluateFilterGroup(row, filter));
  }

  private evaluateFilterGroup(row: any, group: FilterGroup): boolean {
    const conditionResults =
      group.conditions?.map((condition) => this.evaluateCondition(row, condition)) || [];

    const groupResults =
      group.groups?.map((subGroup) => this.evaluateFilterGroup(row, subGroup)) || [];

    const allResults = [...conditionResults, ...groupResults];

    if (allResults.length === 0) return true;

    return group.logic === 'AND'
      ? allResults.every((result) => result)
      : allResults.some((result) => result);
  }

  private evaluateCondition(row: any, condition: any): boolean {
    const value = row[condition.column];
    const filterValue = condition.value;

    // Skip empty conditions
    if (!condition.column || filterValue === '' || filterValue == null) {
      return true;
    }

    switch (condition.operator) {
      case 'equals':
        return value == filterValue;
      case 'contains':
        return value?.toString().toLowerCase().includes(filterValue?.toLowerCase());
      case 'startsWith':
        return value?.toString().toLowerCase().startsWith(filterValue?.toLowerCase());
      case 'endsWith':
        return value?.toString().toLowerCase().endsWith(filterValue?.toLowerCase());
      case 'gt':
        return Number(value) > Number(filterValue);
      case 'lt':
        return Number(value) < Number(filterValue);
      case 'gte':
        return Number(value) >= Number(filterValue);
      case 'lte':
        return Number(value) <= Number(filterValue);
      default:
        return true;
    }
  }

  private applyQuickFilter(data: any[]): any[] {
    const activeFilter = this.activeQuickFilter();
    if (!activeFilter) return data;

    const filter = this.quickFilters().find((f) => f.key === activeFilter);
    return filter ? filter.filterFn(data) : data;
  }

  onQuickFilterClick(filterKey: string): void {
    this.activeQuickFilter.set(this.activeQuickFilter() === filterKey ? null : filterKey);
  }

  clearAllFilters(): void {
    this.globalSearchTerm.set('');
    this.columnFilters.set(new Map());
    this.advancedFilter.set(null);
    this.activeQuickFilter.set(null);
  }

  private getPaginatedData(data: any[]): any[] {
    if (!this.showPagination()) return data;
    const start = this.pageIndex() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  }

  isAllSelected() {
    return this.selection.selected.length === this.data().length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.data());
    }
    this.selectionChange.emit(this.selection.selected);
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  onActionClick(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  onBulkActionClick(action: string) {
    const selectedRows = this.selection.selected.filter((row) => !row._isGroupHeader);
    this.bulkActionClick.emit({ action, rows: selectedRows });
  }

  hasSelectedRows(): boolean {
    return this.selection.selected.length > 0;
  }

  getSelectedCount(): number {
    return this.selection.selected.filter((row) => !row._isGroupHeader).length;
  }

  onRowMenuAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  onRowDrop(event: any) {
    const data = [...this.displayData()];
    const item = data.splice(event.previousIndex, 1)[0];
    data.splice(event.currentIndex, 0, item);
    this.rowReorder.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
      data,
    });
  }

  exportData(format: ExportFormat) {
    const data = this.displayData().filter((row) => !row._isGroupHeader);
    const columns = this.columns().filter((col) => col.type !== 'actions');

    switch (format) {
      case 'csv':
        this.exportToCsv(data, columns);
        break;
      case 'json':
        this.exportToJson(data, columns);
        break;
      case 'excel':
        this.exportToExcel(data, columns);
        break;
      case 'pdf':
        this.exportToPdf(data, columns);
        break;
    }
  }

  private exportToCsv(data: any[], columns: TableColumn[]) {
    const headers = columns.map((col) => col.label).join(',');
    const rows = data
      .map((row) => columns.map((col) => `"${row[col.key] || ''}"`).join(','))
      .join('\n');

    const csv = `${headers}\n${rows}`;
    this.downloadFile(csv, 'data.csv', 'text/csv');
  }

  private exportToJson(data: any[], columns: TableColumn[]) {
    const exportData = data.map((row) => {
      const obj: any = {};
      columns.forEach((col) => {
        obj[col.key] = row[col.key];
      });
      return obj;
    });

    const json = JSON.stringify(exportData, null, 2);
    this.downloadFile(json, 'data.json', 'application/json');
  }

  private exportToExcel(data: any[], columns: TableColumn[]) {
    // Basic Excel export (would need xlsx library for full functionality)
    const headers = columns.map((col) => col.label).join('\t');
    const rows = data.map((row) => columns.map((col) => row[col.key] || '').join('\t')).join('\n');

    const excel = `${headers}\n${rows}`;
    this.downloadFile(excel, 'data.xls', 'application/vnd.ms-excel');
  }

  private exportToPdf(data: any[], columns: TableColumn[]) {
    // Basic PDF export using HTML to PDF conversion
    const htmlContent = `
      <html>
        <head>
          <title>Data Export</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Data Export</h1>
          <table>
            <thead>
              <tr>${columns.map((col) => `<th>${col.label}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map((row) => `<tr>${columns.map((col) => `<td>${row[col.key] || ''}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
    window.URL.revokeObjectURL(url);
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  sort(column: string, event?: MouseEvent) {
    const sortColumns = [...this.sortColumns()];
    const existingIndex = sortColumns.findIndex((s) => s.key === column);

    if (this.multiSort() && event?.ctrlKey) {
      // Multi-column sort with Ctrl+Click
      if (existingIndex >= 0) {
        const existing = sortColumns[existingIndex];
        if (existing.direction === 'desc') {
          sortColumns.splice(existingIndex, 1);
        } else {
          existing.direction = 'desc';
        }
      } else {
        sortColumns.push({
          key: column,
          direction: 'asc',
          priority: sortColumns.length,
        });
      }
    } else {
      // Single column sort
      if (existingIndex >= 0 && sortColumns.length === 1) {
        const existing = sortColumns[0];
        existing.direction = existing.direction === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumns.length = 0;
        sortColumns.push({
          key: column,
          direction: 'asc',
          priority: 0,
        });
      }
    }

    this.sortColumns.set(sortColumns);
  }

  getSortIcon(column: string): string {
    const sortCol = this.sortColumns().find((s) => s.key === column);
    if (!sortCol) return 'unfold_more';
    return sortCol.direction === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  getSortPriority(column: string): number | null {
    const sortCol = this.sortColumns().find((s) => s.key === column);
    return sortCol && this.sortColumns().length > 1 ? sortCol.priority + 1 : null;
  }

  clearSort(): void {
    this.sortColumns.set([]);
  }

  private getGroupedData(data: any[]): any[] {
    if (this.hierarchical()) {
      return this.getHierarchicalData(data);
    }

    const groupByColumn = this.groupBy();
    if (!groupByColumn || !this.showGrouping()) return data;

    const groups = new Map<string, any[]>();
    data.forEach((item) => {
      const groupValue = item[groupByColumn] || 'Ungrouped';
      if (!groups.has(groupValue)) {
        groups.set(groupValue, []);
      }
      groups.get(groupValue)!.push(item);
    });

    const result: any[] = [];
    groups.forEach((items, groupValue) => {
      result.push({
        _isGroupHeader: true,
        _groupValue: groupValue,
        _groupCount: items.length,
        _groupKey: groupByColumn + '_' + groupValue,
      });
      if (this.expandedGroups().has(groupValue)) {
        result.push(...items);
      }
    });

    return result;
  }

  private getHierarchicalData(data: any[]): any[] {
    const result: any[] = [];
    const processedIds = new Set<string>();

    const addNodeAndChildren = (node: any, level = 0) => {
      if (processedIds.has(node.id)) return;
      processedIds.add(node.id);

      node._level = level;
      node._hasChildren = node[this.childrenKey()]?.length > 0;
      result.push(node);

      if (node._hasChildren && this.expandedNodes().has(node.id)) {
        node[this.childrenKey()].forEach((child: any) => {
          addNodeAndChildren(child, level + 1);
        });
      }
    };

    // Find root nodes (no parent or parent not in dataset)
    const rootNodes = data.filter(
      (item) =>
        !item[this.parentKey()] || !data.find((parent) => parent.id === item[this.parentKey()]),
    );

    rootNodes.forEach((root) => addNodeAndChildren(root));

    return result;
  }

  toggleGroup(groupValue: string): void {
    const expanded = new Set(this.expandedGroups());
    if (expanded.has(groupValue)) {
      expanded.delete(groupValue);
    } else {
      expanded.add(groupValue);
    }
    this.expandedGroups.set(expanded);
  }

  isGroupExpanded(groupValue: string): boolean {
    return this.expandedGroups().has(groupValue);
  }

  expandAllGroups(): void {
    const dataSource = this.cachedData().length > 0 ? this.cachedData() : this.data();
    const groupByColumn = this.groupBy();
    if (!groupByColumn) return;

    const allGroups = new Set(dataSource.map((item) => item[groupByColumn] || 'Ungrouped'));
    this.expandedGroups.set(allGroups);
  }

  collapseAllGroups(): void {
    this.expandedGroups.set(new Set());
  }

  toggleNode(nodeId: string): void {
    const expanded = new Set(this.expandedNodes());
    if (expanded.has(nodeId)) {
      expanded.delete(nodeId);
    } else {
      expanded.add(nodeId);
    }
    this.expandedNodes.set(expanded);
  }

  isNodeExpanded(nodeId: string): boolean {
    return this.expandedNodes().has(nodeId);
  }

  expandAllNodes(): void {
    const dataSource = this.cachedData().length > 0 ? this.cachedData() : this.data();
    const allNodeIds = new Set(
      dataSource.filter((item) => item[this.childrenKey()]?.length > 0).map((item) => item.id),
    );
    this.expandedNodes.set(allNodeIds);
  }

  collapseAllNodes(): void {
    this.expandedNodes.set(new Set());
  }

  private getDefaultSortResult(aVal: any, bVal: any, type?: string): number {
    switch (type) {
      case 'number':
        return Number(aVal || 0) - Number(bVal || 0);
      case 'date':
        const dateA = new Date(aVal || 0);
        const dateB = new Date(bVal || 0);
        return dateA.getTime() - dateB.getTime();
      case 'text':
      default:
        const strA = (aVal || '').toString().toLowerCase();
        const strB = (bVal || '').toString().toLowerCase();
        return strA < strB ? -1 : strA > strB ? 1 : 0;
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
