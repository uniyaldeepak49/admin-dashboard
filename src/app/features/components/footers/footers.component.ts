import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-footers',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './footers.component.html',
  styleUrl: './footers.component.scss',
})
export class FootersComponent {
  currentYear = signal(new Date().getFullYear());

  socialLinks = signal([
    { icon: 'facebook', label: 'Facebook', url: '#' },
    { icon: 'twitter', label: 'Twitter', url: '#' },
    { icon: 'linkedin', label: 'LinkedIn', url: '#' },
    { icon: 'github', label: 'GitHub', url: '#' },
  ]);

  footerLinks = signal([
    { label: 'About', url: '#' },
    { label: 'Privacy', url: '#' },
    { label: 'Terms', url: '#' },
    { label: 'Contact', url: '#' },
  ]);

  companyInfo = signal({
    name: 'AdminPro',
    description: 'Professional admin dashboard template',
    version: 'v1.0.0',
  });
}
