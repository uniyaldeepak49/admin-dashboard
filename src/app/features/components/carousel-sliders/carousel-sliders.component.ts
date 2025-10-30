import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
}

@Component({
  selector: 'app-carousel-sliders',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './carousel-sliders.component.html',
  styleUrl: './carousel-sliders.component.scss',
})
export class CarouselSlidersComponent {
  currentSlide = signal(0);
  autoPlay = signal(true);

  slides = signal<CarouselItem[]>([
    {
      id: 1,
      title: 'Dashboard Analytics',
      description: 'Comprehensive data visualization',
      image: '📊',
      color: '#3b82f6',
    },
    {
      id: 2,
      title: 'User Management',
      description: 'Manage users and permissions',
      image: '👥',
      color: '#10b981',
    },
    {
      id: 3,
      title: 'Reports & Insights',
      description: 'Generate detailed reports',
      image: '📈',
      color: '#f59e0b',
    },
    {
      id: 4,
      title: 'Security Features',
      description: 'Advanced security controls',
      image: '🔒',
      color: '#ef4444',
    },
  ]);

  testimonials = signal([
    {
      name: 'John Doe',
      role: 'CEO',
      company: 'TechCorp',
      message: 'Excellent dashboard solution for our business needs.',
      avatar: 'JD',
    },
    {
      name: 'Jane Smith',
      role: 'Manager',
      company: 'DataFlow',
      message: 'User-friendly interface with powerful analytics.',
      avatar: 'JS',
    },
    {
      name: 'Mike Johnson',
      role: 'Developer',
      company: 'CodeBase',
      message: 'Great component library and documentation.',
      avatar: 'MJ',
    },
  ]);

  products = signal([
    {
      name: 'Analytics Pro',
      price: '$99',
      features: ['Advanced Charts', 'Real-time Data', 'Export Options'],
      color: '#8b5cf6',
    },
    {
      name: 'Dashboard Plus',
      price: '$149',
      features: ['Custom Widgets', 'API Access', 'Team Collaboration'],
      color: '#06b6d4',
    },
    {
      name: 'Enterprise Suite',
      price: '$299',
      features: ['White Label', 'Priority Support', 'Custom Integration'],
      color: '#f97316',
    },
  ]);

  currentTestimonial = signal(0);
  currentProduct = signal(0);

  nextSlide() {
    this.currentSlide.update((current) => (current === this.slides().length - 1 ? 0 : current + 1));
  }

  prevSlide() {
    this.currentSlide.update((current) => (current === 0 ? this.slides().length - 1 : current - 1));
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  nextTestimonial() {
    this.currentTestimonial.update((current) =>
      current === this.testimonials().length - 1 ? 0 : current + 1,
    );
  }

  prevTestimonial() {
    this.currentTestimonial.update((current) =>
      current === 0 ? this.testimonials().length - 1 : current - 1,
    );
  }

  nextProduct() {
    this.currentProduct.update((current) =>
      current === this.products().length - 1 ? 0 : current + 1,
    );
  }

  prevProduct() {
    this.currentProduct.update((current) =>
      current === 0 ? this.products().length - 1 : current - 1,
    );
  }

  toggleAutoPlay() {
    this.autoPlay.update((value) => !value);
  }
}
