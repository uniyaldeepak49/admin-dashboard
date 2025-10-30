import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  selectedCategory = signal('all');
  selectedProject = signal<PortfolioItem | null>(null);

  portfolioItems = signal<PortfolioItem[]>([
    {
      id: 1,
      title: 'E-Commerce Dashboard',
      description: 'Modern admin dashboard for e-commerce management with real-time analytics',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      category: 'web',
      technologies: ['Angular', 'TypeScript', 'Material Design', 'Chart.js'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      category: 'mobile',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'JWT'],
      demoUrl: '#',
    },
    {
      id: 3,
      title: 'Data Visualization Tool',
      description: 'Interactive data visualization platform for business intelligence',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      category: 'web',
      technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI'],
      githubUrl: '#',
    },
    {
      id: 4,
      title: 'Task Management System',
      description: 'Collaborative project management tool with real-time updates',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      category: 'web',
      technologies: ['React', 'Redux', 'Socket.io', 'Express'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 5,
      title: 'AI Chat Assistant',
      description: 'Intelligent chatbot with natural language processing capabilities',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      category: 'ai',
      technologies: ['Python', 'TensorFlow', 'NLP', 'Flask'],
      demoUrl: '#',
    },
    {
      id: 6,
      title: 'Fitness Tracking App',
      description: 'Cross-platform fitness app with workout tracking and social features',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      category: 'mobile',
      technologies: ['Flutter', 'Dart', 'Firebase', 'Google Fit API'],
      githubUrl: '#',
    },
  ]);

  categories = signal([
    { value: 'all', label: 'All Projects' },
    { value: 'web', label: 'Web Apps' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'ai', label: 'AI/ML' },
  ]);

  filteredItems = signal<PortfolioItem[]>([]);

  constructor() {
    this.updateFilteredItems();
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.updateFilteredItems();
  }

  private updateFilteredItems(): void {
    const category = this.selectedCategory();
    if (category === 'all') {
      this.filteredItems.set(this.portfolioItems());
    } else {
      this.filteredItems.set(this.portfolioItems().filter((item) => item.category === category));
    }
  }

  openProjectDetails(project: PortfolioItem): void {
    this.selectedProject.set(project);
  }

  closeProjectDetails(): void {
    this.selectedProject.set(null);
  }
}
