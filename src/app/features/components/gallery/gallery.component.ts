import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatGridListModule, MatDialogModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  selectedCategory = signal('all');
  selectedImage = signal<GalleryItem | null>(null);

  galleryItems = signal<GalleryItem[]>([
    {
      id: 1,
      title: 'Modern Dashboard',
      description: 'Clean and intuitive dashboard design',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      category: 'dashboard',
    },
    {
      id: 2,
      title: 'Data Analytics',
      description: 'Beautiful data visualization charts',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      category: 'charts',
    },
    {
      id: 3,
      title: 'Team Collaboration',
      description: 'User management and team features',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      category: 'users',
    },
    {
      id: 4,
      title: 'Data Tables',
      description: 'Interactive and responsive data grids',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      category: 'tables',
    },
    {
      id: 5,
      title: 'Form Design',
      description: 'Beautiful and functional form layouts',
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop',
      category: 'forms',
    },
    {
      id: 6,
      title: 'UI Components',
      description: 'Modern Material Design components',
      imageUrl: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=600&fit=crop',
      category: 'layout',
    },
    {
      id: 7,
      title: 'Mobile Interface',
      description: 'Responsive mobile-first design',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      category: 'dashboard',
    },
    {
      id: 8,
      title: 'Business Analytics',
      description: 'Advanced reporting and insights',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      category: 'charts',
    },
  ]);

  categories = signal([
    { value: 'all', label: 'All Items' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'charts', label: 'Charts' },
    { value: 'users', label: 'Users' },
    { value: 'tables', label: 'Tables' },
    { value: 'forms', label: 'Forms' },
    { value: 'layout', label: 'Layout' },
  ]);

  filteredItems = signal<GalleryItem[]>([]);

  constructor(private dialog: MatDialog) {
    this.updateFilteredItems();
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.updateFilteredItems();
  }

  private updateFilteredItems(): void {
    const category = this.selectedCategory();
    if (category === 'all') {
      this.filteredItems.set(this.galleryItems());
    } else {
      this.filteredItems.set(this.galleryItems().filter((item) => item.category === category));
    }
  }

  openImageDialog(item: GalleryItem): void {
    this.selectedImage.set(item);
  }

  closeImageDialog(): void {
    this.selectedImage.set(null);
  }
}
