import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatBadgeModule,
  ],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent {
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 199,
      image: 'headphones',
      rating: 4.5,
      category: 'Electronics',
    },
    { id: 2, name: 'Smart Watch', price: 299, image: 'watch', rating: 4.8, category: 'Wearables' },
    {
      id: 3,
      name: 'Laptop Stand',
      price: 89,
      image: 'laptop',
      rating: 4.2,
      category: 'Accessories',
    },
  ]);

  teamMembers = signal<TeamMember[]>([
    { id: 1, name: 'John Doe', role: 'Frontend Developer', avatar: 'person', status: 'online' },
    { id: 2, name: 'Jane Smith', role: 'UI/UX Designer', avatar: 'person', status: 'away' },
    { id: 3, name: 'Mike Johnson', role: 'Backend Developer', avatar: 'person', status: 'offline' },
  ]);

  stats = signal([
    {
      title: 'Total Sales',
      value: '$45,210',
      change: '+12%',
      icon: 'trending_up',
      color: 'success',
    },
    { title: 'New Users', value: '1,234', change: '+8%', icon: 'person_add', color: 'primary' },
    { title: 'Orders', value: '856', change: '-3%', icon: 'shopping_cart', color: 'warning' },
    { title: 'Revenue', value: '$12,450', change: '+15%', icon: 'attach_money', color: 'success' },
  ]);

  projects = signal([
    { name: 'Website Redesign', progress: 75, status: 'In Progress', dueDate: '2024-02-15' },
    { name: 'Mobile App', progress: 45, status: 'Planning', dueDate: '2024-03-01' },
    { name: 'API Integration', progress: 90, status: 'Review', dueDate: '2024-01-30' },
  ]);
}
