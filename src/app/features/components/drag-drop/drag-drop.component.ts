import { Component, signal } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [DragDropModule, MatCardModule, MatIconModule, MatButtonModule, MatListModule],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.scss',
})
export class DragDropComponent {
  sortableItems = signal(['Angular', 'React', 'Vue.js', 'Node.js', 'Python', 'Java']);

  todoTasks = signal<Task[]>([
    {
      id: 1,
      title: 'Design Homepage',
      description: 'Create wireframes and mockups',
      priority: 'high',
    },
    { id: 2, title: 'Setup Database', description: 'Configure PostgreSQL', priority: 'medium' },
    { id: 3, title: 'Write Tests', description: 'Unit and integration tests', priority: 'low' },
  ]);

  inProgressTasks = signal<Task[]>([
    { id: 4, title: 'API Development', description: 'Build REST endpoints', priority: 'high' },
    { id: 5, title: 'User Authentication', description: 'Implement JWT auth', priority: 'medium' },
  ]);

  doneTasks = signal<Task[]>([
    { id: 6, title: 'Project Setup', description: 'Initialize repository', priority: 'low' },
  ]);

  onSortableDrop(event: CdkDragDrop<string[]>) {
    const items = [...this.sortableItems()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.sortableItems.set(items);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      const tasks = [...event.container.data];
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);
      this.updateTaskList(event.container.id, tasks);
    } else {
      const sourceData = [...event.previousContainer.data];
      const targetData = [...event.container.data];

      transferArrayItem(sourceData, targetData, event.previousIndex, event.currentIndex);

      this.updateTaskList(event.previousContainer.id, sourceData);
      this.updateTaskList(event.container.id, targetData);
    }
  }

  private updateTaskList(containerId: string, tasks: Task[]) {
    switch (containerId) {
      case 'todo':
        this.todoTasks.set(tasks);
        break;
      case 'inProgress':
        this.inProgressTasks.set(tasks);
        break;
      case 'done':
        this.doneTasks.set(tasks);
        break;
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority_high';
      case 'medium':
        return 'remove';
      case 'low':
        return 'keyboard_arrow_down';
      default:
        return 'remove';
    }
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  resetLists() {
    this.sortableItems.set(['Angular', 'React', 'Vue.js', 'Node.js', 'Python', 'Java']);
    this.todoTasks.set([
      {
        id: 1,
        title: 'Design Homepage',
        description: 'Create wireframes and mockups',
        priority: 'high',
      },
      { id: 2, title: 'Setup Database', description: 'Configure PostgreSQL', priority: 'medium' },
      { id: 3, title: 'Write Tests', description: 'Unit and integration tests', priority: 'low' },
    ]);
    this.inProgressTasks.set([
      { id: 4, title: 'API Development', description: 'Build REST endpoints', priority: 'high' },
      {
        id: 5,
        title: 'User Authentication',
        description: 'Implement JWT auth',
        priority: 'medium',
      },
    ]);
    this.doneTasks.set([
      { id: 6, title: 'Project Setup', description: 'Initialize repository', priority: 'low' },
    ]);
  }
}
