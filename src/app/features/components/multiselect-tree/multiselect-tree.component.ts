import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface TreeNode {
  name: string;
  children?: TreeNode[];
  selected?: boolean;
  indeterminate?: boolean;
}

@Component({
  selector: 'app-multiselect-tree',
  standalone: true,
  imports: [
    MatCardModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './multiselect-tree.component.html',
  styleUrl: './multiselect-tree.component.scss',
})
export class MultiselectTreeComponent {
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  selectedItems = signal<string[]>([]);
  dropdownControl = new FormControl<string[]>([]);
  dropdownSelectedItems = signal<string[]>([]);

  flatTreeOptions: string[] = [];

  treeData: TreeNode[] = [
    {
      name: 'Frontend',
      children: [
        {
          name: 'Frameworks',
          children: [{ name: 'Angular' }, { name: 'React' }, { name: 'Vue.js' }],
        },
        {
          name: 'Languages',
          children: [
            { name: 'TypeScript' },
            { name: 'JavaScript' },
            { name: 'HTML' },
            { name: 'CSS' },
          ],
        },
      ],
    },
    {
      name: 'Backend',
      children: [
        {
          name: 'Languages',
          children: [{ name: 'Node.js' }, { name: 'Python' }, { name: 'Java' }, { name: 'C#' }],
        },
        {
          name: 'Databases',
          children: [{ name: 'MongoDB' }, { name: 'PostgreSQL' }, { name: 'MySQL' }],
        },
      ],
    },
    {
      name: 'DevOps',
      children: [{ name: 'Docker' }, { name: 'Kubernetes' }, { name: 'AWS' }, { name: 'Azure' }],
    },
  ];

  constructor() {
    this.dataSource.data = this.treeData;
    this.flatTreeOptions = this.flattenTree(this.treeData);
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  onNodeToggle(node: TreeNode) {
    node.selected = !(node.selected ?? false);
    this.updateChildNodes(node, node.selected);
    this.updateParentNodes(node);
    this.updateSelectedItems();
  }

  private updateChildNodes(node: TreeNode, selected: boolean) {
    if (node.children) {
      node.children.forEach((child) => {
        child.selected = selected;
        child.indeterminate = false;
        this.updateChildNodes(child, selected);
      });
    }
  }

  private updateParentNodes(node: TreeNode) {
    const parent = this.getParentNode(node);
    if (parent?.children) {
      const allSelected = parent.children.every((child) => (child.selected ?? false) === true);
      const someSelected = parent.children.some(
        (child) => (child.selected ?? false) === true || (child.indeterminate ?? false) === true,
      );

      parent.selected = allSelected;
      parent.indeterminate = !allSelected && someSelected;

      this.updateParentNodes(parent);
    }
  }

  private getParentNode(node: TreeNode): TreeNode | null {
    return this.findParentInTree(this.treeData, node);
  }

  private findParentInTree(nodes: TreeNode[], target: TreeNode): TreeNode | null {
    for (const parent of nodes) {
      if (parent.children?.includes(target)) {
        return parent;
      }
      if (parent.children) {
        const found = this.findParentInTree(parent.children, target);
        if (found) return found;
      }
    }
    return null;
  }

  private updateSelectedItems() {
    const selected: string[] = [];
    this.collectSelectedLeafNodes(this.treeData, selected);
    this.selectedItems.set(selected);
  }

  private collectSelectedLeafNodes(nodes: TreeNode[], selected: string[]) {
    nodes.forEach((node) => {
      if (!node.children && node.selected) {
        selected.push(node.name);
      } else if (node.children) {
        this.collectSelectedLeafNodes(node.children, selected);
      }
    });
  }

  clearAll() {
    this.clearNodeSelection(this.treeData);
    this.selectedItems.set([]);
  }

  private clearNodeSelection(nodes: TreeNode[]) {
    nodes.forEach((node) => {
      node.selected = false;
      node.indeterminate = false;
      if (node.children) {
        this.clearNodeSelection(node.children);
      }
    });
  }

  selectAll() {
    this.selectAllNodes(this.treeData);
    this.updateSelectedItems();
  }

  private selectAllNodes(nodes: TreeNode[]) {
    nodes.forEach((node) => {
      node.selected = true;
      node.indeterminate = false;
      if (node.children) {
        this.selectAllNodes(node.children);
      }
    });
  }

  private flattenTree(nodes: TreeNode[], prefix = ''): string[] {
    const result: string[] = [];
    if (!nodes) return result;
    nodes.forEach((node) => {
      if (!node.children) {
        result.push(prefix ? `${prefix} > ${node.name}` : node.name);
      } else {
        result.push(
          ...this.flattenTree(node.children, prefix ? `${prefix} > ${node.name}` : node.name),
        );
      }
    });
    return result;
  }

  onDropdownSelectionChange(values: string[]) {
    this.dropdownSelectedItems.set(values);
  }

  clearDropdownSelection() {
    this.dropdownControl.setValue([]);
    this.dropdownSelectedItems.set([]);
  }

  getFullPath(category: string, subcategory: string, item: string): string {
    return subcategory ? `${category} > ${subcategory} > ${item}` : `${category} > ${item}`;
  }

  isCategorySelected(category: TreeNode): boolean {
    return (
      category.children?.every((child) =>
        child.children ? child.children.every((item) => item.selected) : child.selected,
      ) ?? false
    );
  }

  isCategoryIndeterminate(category: TreeNode): boolean {
    const hasSelected =
      category.children?.some((child) =>
        child.children ? child.children.some((item) => item.selected) : child.selected,
      ) ?? false;
    const allSelected = this.isCategorySelected(category);
    return hasSelected && !allSelected;
  }

  isSubcategorySelected(subcategory: TreeNode): boolean {
    return subcategory.children?.every((item) => item.selected) ?? false;
  }

  isSubcategoryIndeterminate(subcategory: TreeNode): boolean {
    const hasSelected = subcategory.children?.some((item) => item.selected) ?? false;
    const allSelected = this.isSubcategorySelected(subcategory);
    return hasSelected && !allSelected;
  }

  isItemSelected(item: TreeNode): boolean {
    return item.selected ?? false;
  }

  onCategoryToggle(category: TreeNode, checked: boolean) {
    this.updateChildNodes(category, checked);
    this.updateDropdownSelection();
  }

  onSubcategoryToggle(subcategory: TreeNode, checked: boolean) {
    this.updateChildNodes(subcategory, checked);
    this.updateDropdownSelection();
  }

  onItemToggle(item: TreeNode, checked: boolean) {
    item.selected = checked;
    this.updateDropdownSelection();
  }

  private updateDropdownSelection() {
    const selected: string[] = [];
    this.treeData?.forEach((category) => {
      if (category.children) {
        category.children.forEach((subcategory) => {
          if (subcategory.children) {
            subcategory.children.forEach((item) => {
              if (item.selected) {
                selected.push(this.getFullPath(category.name, subcategory.name, item.name));
              }
            });
          } else if (subcategory.selected) {
            selected.push(this.getFullPath(category.name, '', subcategory.name));
          }
        });
      }
    });
    this.dropdownControl.setValue(selected);
    this.dropdownSelectedItems.set(selected);
  }
}
