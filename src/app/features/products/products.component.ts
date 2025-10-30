import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 199,
      stock: 45,
      status: 'active',
      image: 'headphones',
    },
    {
      id: 2,
      name: 'Smart Watch',
      category: 'Wearables',
      price: 299,
      stock: 23,
      status: 'active',
      image: 'watch',
    },
    {
      id: 3,
      name: 'Laptop Stand',
      category: 'Accessories',
      price: 89,
      stock: 0,
      status: 'inactive',
      image: 'laptop',
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      price: 149,
      stock: 67,
      status: 'active',
      image: 'speaker',
    },
  ]);

  categories = ['All', 'Electronics', 'Wearables', 'Accessories'];
  selectedCategory = signal('All');

  addProduct() {
    console.log('Add new product');
  }

  editProduct(product: Product) {
    console.log('Edit product:', product);
  }

  deleteProduct(id: number) {
    this.products.update((current) => current.filter((p) => p.id !== id));
  }
}
