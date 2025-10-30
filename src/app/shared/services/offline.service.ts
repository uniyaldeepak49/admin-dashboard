import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  isOnline = signal(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }
}
