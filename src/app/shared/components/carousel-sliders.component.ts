import { Component, input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

export interface CarouselSlide {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
}

@Component({
  selector: 'app-carousel-sliders',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './carousel-sliders.component.html',
  styleUrl: './carousel-sliders.component.scss',
})
export class CarouselSlidersComponent {
  slides = input.required<CarouselSlide[]>();
  autoPlay = input<boolean>(true);
  interval = input<number>(3000);
  showIndicators = input<boolean>(true);
  showNavigation = input<boolean>(true);

  currentIndex = signal(0);
  isPlaying = signal(true);

  totalSlides = computed(() => this.slides().length);
  currentSlide = computed(() => this.slides()[this.currentIndex()]);

  private intervalId: number | null = null;

  constructor() {
    effect(() => {
      if (this.autoPlay() && this.isPlaying()) {
        this.startAutoPlay();
      } else {
        this.stopAutoPlay();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  nextSlide(): void {
    this.currentIndex.update((index) => (index === this.totalSlides() - 1 ? 0 : index + 1));
  }

  previousSlide(): void {
    this.currentIndex.update((index) => (index === 0 ? this.totalSlides() - 1 : index - 1));
  }

  goToSlide(index: number): void {
    this.currentIndex.set(index);
  }

  togglePlayPause(): void {
    this.isPlaying.update((playing) => !playing);
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, this.interval());
  }

  private stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
