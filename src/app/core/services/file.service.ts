import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface CloudProvider {
  id: string;
  name: string;
  type: 'aws-s3' | 'google-drive' | 'dropbox' | 'onedrive';
  connected: boolean;
  config?: Record<string, string>;
}

export interface FileUploadProgress {
  fileId: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private cloudProviders = signal<CloudProvider[]>([
    {
      id: '1',
      name: 'AWS S3',
      type: 'aws-s3',
      connected: false,
    },
    {
      id: '2',
      name: 'Google Drive',
      type: 'google-drive',
      connected: true,
    },
    {
      id: '3',
      name: 'Dropbox',
      type: 'dropbox',
      connected: false,
    },
    {
      id: '4',
      name: 'OneDrive',
      type: 'onedrive',
      connected: false,
    },
  ]);

  getCloudProviders(): CloudProvider[] {
    return this.cloudProviders();
  }

  connectCloudProvider(providerId: string, config: Record<string, string>): Observable<boolean> {
    // Simulate API call
    return of(true).pipe(delay(1000));
  }

  disconnectCloudProvider(providerId: string): Observable<boolean> {
    // Simulate API call
    return of(true).pipe(delay(500));
  }

  uploadFile(file: File, folderId: string, cloudProvider?: string): Observable<FileUploadProgress> {
    // Simulate file upload with progress
    return new Observable((observer) => {
      let progress = 0;
      const fileId = Date.now().toString();

      observer.next({
        fileId,
        progress: 0,
        status: 'pending',
      });

      const interval = setInterval(() => {
        progress += Math.random() * 20;

        if (progress >= 100) {
          progress = 100;
          observer.next({
            fileId,
            progress: 100,
            status: 'completed',
          });
          observer.complete();
          clearInterval(interval);
        } else {
          observer.next({
            fileId,
            progress: Math.round(progress),
            status: 'uploading',
          });
        }
      }, 200);
    });
  }

  downloadFile(fileId: string): Observable<Blob> {
    // Simulate file download
    return of(new Blob(['Sample file content'], { type: 'text/plain' })).pipe(delay(1000));
  }

  shareFile(fileId: string, permissions: string[], expiryDate?: Date): Observable<string> {
    // Simulate sharing and return share URL
    const shareUrl = `https://files.example.com/shared/${fileId}`;
    return of(shareUrl).pipe(delay(500));
  }

  getFileVersions(fileId: string): Observable<any[]> {
    // Mock version history
    const versions = [
      {
        id: '1',
        version: 1,
        createdAt: new Date('2024-01-15'),
        createdBy: 'John Doe',
        size: 1024000,
        url: 'https://example.com/file/v1',
      },
      {
        id: '2',
        version: 2,
        createdAt: new Date('2024-01-18'),
        createdBy: 'Jane Smith',
        size: 1048576,
        url: 'https://example.com/file/v2',
      },
    ];

    return of(versions).pipe(delay(300));
  }

  createFolder(name: string, parentId: string): Observable<any> {
    // Simulate folder creation
    const folder = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      createdAt: new Date(),
      modifiedAt: new Date(),
      parentId,
      path: `/${name}`,
    };

    return of(folder).pipe(delay(300));
  }

  deleteFile(fileId: string): Observable<boolean> {
    // Simulate file deletion
    return of(true).pipe(delay(500));
  }

  searchFiles(query: string, folderId?: string): Observable<any[]> {
    // Mock search results
    const results = [
      {
        id: 'search1',
        name: `${query}_document.pdf`,
        type: 'file',
        size: 2048576,
        mimeType: 'application/pdf',
        path: '/Documents',
        relevance: 0.95,
      },
    ];

    return of(results).pipe(delay(800));
  }

  getStorageStats(): Observable<any> {
    // Mock storage statistics
    const stats = {
      totalSpace: 107374182400, // 100GB
      usedSpace: 32212254720, // 30GB
      availableSpace: 75161927680, // 70GB
      fileCount: 1247,
      folderCount: 89,
      recentFiles: 23,
      sharedFiles: 12,
    };

    return of(stats).pipe(delay(400));
  }
}
