import { Injectable, signal } from '@angular/core';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export type RefreshStrategy = 'manual' | 'time-based' | 'stale-while-revalidate';

@Injectable({
  providedIn: 'root',
})
export class DataCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private localStorage = window.localStorage;
  private OFFLINE_PREFIX = 'offline_cache_';

  set<T>(key: string, data: T, ttlMs = 300000): void {
    // 5min default
    const entry = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };
    this.cache.set(key, entry);
    this.saveToLocalStorage(key, entry);
  }

  private saveToLocalStorage<T>(key: string, entry: CacheEntry<T>): void {
    try {
      this.localStorage.setItem(this.OFFLINE_PREFIX + key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage<T>(key: string): CacheEntry<T> | undefined {
    try {
      const stored = this.localStorage.getItem(this.OFFLINE_PREFIX + key);
      return stored ? JSON.parse(stored) : undefined;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return undefined;
    }
  }

  get<T>(
    key: string,
    refreshFn?: () => Promise<T>,
    strategy: RefreshStrategy = 'time-based',
    isOffline = false,
  ): T | null {
    let entry = this.cache.get(key);

    if (!entry) {
      const localEntry = this.loadFromLocalStorage<T>(key);
      if (localEntry) {
        entry = localEntry;
        this.cache.set(key, entry);
      }
    }

    if (!entry) {
      if (refreshFn && !isOffline) this.refreshData(key, refreshFn);
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isOffline) {
      return entry.data; // Return cached data regardless of expiration when offline
    }

    if (strategy === 'stale-while-revalidate' && isExpired && refreshFn) {
      this.refreshData(key, refreshFn);
      return entry.data;
    }

    if (strategy === 'time-based' && isExpired) {
      this.cache.delete(key);
      if (refreshFn) this.refreshData(key, refreshFn);
      return null;
    }

    return entry.data;
  }

  private async refreshData<T>(key: string, refreshFn: () => Promise<T>): Promise<void> {
    try {
      const data = await refreshFn();
      const entry = this.cache.get(key);
      this.set(key, data, entry?.ttl || 300000);
    } catch (error) {
      console.error('Cache refresh failed:', error);
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.localStorage.removeItem(this.OFFLINE_PREFIX + key);
  }

  clear(): void {
    this.cache.clear();
    Object.keys(this.localStorage)
      .filter((key) => key.startsWith(this.OFFLINE_PREFIX))
      .forEach((key) => this.localStorage.removeItem(key));
  }
}
