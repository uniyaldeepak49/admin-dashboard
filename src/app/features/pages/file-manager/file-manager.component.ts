import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { FileUploadDialogComponent } from './file-upload-dialog.component';
import { CreateFolderDialogComponent } from './create-folder-dialog.component';
import { FileViewerDialogComponent } from './file-viewer-dialog.component';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  createdAt: Date;
  modifiedAt: Date;
  parentId?: string;
  path: string;
  url?: string;
  versions?: FileVersion[];
  sharedWith?: string[];
  tags?: string[];
}

export interface FileVersion {
  id: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  size: number;
  url: string;
}

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
  ],
  template: `
    <div class="file-manager">
      <mat-toolbar class="toolbar">
        <button mat-icon-button (click)="navigateUp()" [disabled]="!canNavigateUp()">
          <mat-icon>arrow_back</mat-icon>
        </button>

        <span class="breadcrumb">
          @for (crumb of breadcrumbs(); track crumb.id) {
            <span class="breadcrumb-item" (click)="navigateToFolder(crumb.id)">
              {{ crumb.name }}
            </span>
            @if (!$last) {
              <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
            }
          }
        </span>

        <div class="toolbar-actions">
          <button mat-raised-button color="primary" (click)="uploadFiles()">
            <mat-icon>upload</mat-icon>
            Upload
          </button>

          <button mat-button (click)="createFolder()">
            <mat-icon>create_new_folder</mat-icon>
            New Folder
          </button>

          <button mat-icon-button [matMenuTriggerFor]="viewMenu">
            <mat-icon>view_module</mat-icon>
          </button>
          <mat-menu #viewMenu="matMenu">
            <button mat-menu-item (click)="setViewMode('grid')">
              <mat-icon>view_module</mat-icon>
              Grid View
            </button>
            <button mat-menu-item (click)="setViewMode('list')">
              <mat-icon>view_list</mat-icon>
              List View
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>

      @if (isUploading()) {
        <mat-progress-bar mode="determinate" [value]="uploadProgress()"></mat-progress-bar>
      }

      <div
        class="file-content"
        [class.grid-view]="viewMode() === 'grid'"
        [class.list-view]="viewMode() === 'list'"
      >
        @if (viewMode() === 'grid') {
          <div class="file-grid">
            @for (item of currentFiles(); track item.id) {
              <mat-card class="file-card" (click)="selectFile(item)" (dblclick)="openFile(item)">
                <div class="file-icon">
                  @if (item.type === 'folder') {
                    <mat-icon>folder</mat-icon>
                  } @else {
                    <mat-icon>{{ getFileIcon(item.mimeType || '') }}</mat-icon>
                  }
                </div>
                <div class="file-name">{{ item.name }}</div>
                @if (item.type === 'file') {
                  <div class="file-size">{{ formatFileSize(item.size || 0) }}</div>
                }
                <div class="file-actions">
                  <button
                    mat-icon-button
                    [matMenuTriggerFor]="fileMenu"
                    (click)="$event.stopPropagation()"
                  >
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #fileMenu="matMenu">
                    @if (item.type === 'file') {
                      <button mat-menu-item (click)="previewFile(item)">
                        <mat-icon>visibility</mat-icon>
                        Preview
                      </button>
                      <button mat-menu-item (click)="downloadFile(item)">
                        <mat-icon>download</mat-icon>
                        Download
                      </button>
                    }
                    <button mat-menu-item (click)="shareFile(item)">
                      <mat-icon>share</mat-icon>
                      Share
                    </button>
                    <button mat-menu-item (click)="deleteFile(item)" class="delete-action">
                      <mat-icon>delete</mat-icon>
                      Delete
                    </button>
                  </mat-menu>
                </div>
              </mat-card>
            }
          </div>
        } @else {
          <mat-list class="file-list">
            @for (item of currentFiles(); track item.id) {
              <mat-list-item (click)="selectFile(item)" (dblclick)="openFile(item)">
                <mat-icon matListItemIcon>
                  {{ item.type === 'folder' ? 'folder' : getFileIcon(item.mimeType || '') }}
                </mat-icon>
                <div matListItemTitle>{{ item.name }}</div>
                <div matListItemLine>
                  @if (item.type === 'file') {
                    {{ formatFileSize(item.size || 0) }} • {{ item.modifiedAt | date: 'short' }}
                  } @else {
                    Folder • {{ item.modifiedAt | date: 'short' }}
                  }
                </div>
              </mat-list-item>
              <mat-divider></mat-divider>
            }
          </mat-list>
        }

        @if (currentFiles().length === 0) {
          <div class="empty-state">
            <mat-icon>folder_open</mat-icon>
            <h3>No files or folders</h3>
            <p>Upload files or create folders to get started</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .file-manager {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .toolbar {
        background: white;
        color: rgba(0, 0, 0, 0.87);
        border-bottom: 1px solid #e0e0e0;
      }

      .breadcrumb {
        flex: 1;
        display: flex;
        align-items: center;
        margin: 0 16px;
      }

      .breadcrumb-item {
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .breadcrumb-item:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .breadcrumb-separator {
        font-size: 16px;
        margin: 0 4px;
      }

      .toolbar-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .file-content {
        flex: 1;
        overflow: auto;
        padding: 16px;
      }

      .file-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }

      .file-card {
        cursor: pointer;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
        position: relative;
      }

      .file-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
      }

      .file-icon {
        text-align: center;
        padding: 16px;
      }

      .file-icon mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #666;
      }

      .file-name {
        padding: 0 16px;
        font-weight: 500;
        text-align: center;
        word-break: break-word;
      }

      .file-size {
        padding: 8px 16px 16px;
        text-align: center;
        color: #666;
        font-size: 12px;
      }

      .file-actions {
        position: absolute;
        top: 8px;
        right: 8px;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .file-card:hover .file-actions {
        opacity: 1;
      }

      .file-list {
        background: white;
        border-radius: 8px;
      }

      .empty-state {
        text-align: center;
        padding: 64px 16px;
        color: #666;
      }

      .empty-state mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      .delete-action {
        color: #f44336;
      }
    `,
  ],
})
export class FileManagerComponent {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  files = signal<FileItem[]>([]);
  currentFolderId = signal<string>('root');
  selectedFiles = signal<FileItem[]>([]);
  viewMode = signal<'grid' | 'list'>('grid');
  isUploading = signal(false);
  uploadProgress = signal(0);

  currentFiles = computed(() =>
    this.files().filter((file) => file.parentId === this.currentFolderId()),
  );

  breadcrumbs = computed(() => {
    const crumbs = [{ id: 'root', name: 'Files' }];
    let currentId = this.currentFolderId();

    while (currentId !== 'root') {
      const folder = this.files().find((f) => f.id === currentId && f.type === 'folder');
      if (folder) {
        crumbs.push({ id: folder.id, name: folder.name });
        currentId = folder.parentId || 'root';
      } else {
        break;
      }
    }

    return crumbs;
  });

  constructor() {
    this.loadFiles();
  }

  loadFiles(): void {
    this.files.set([
      {
        id: '1',
        name: 'Documents',
        type: 'folder',
        createdAt: new Date('2024-01-15'),
        modifiedAt: new Date('2024-01-20'),
        parentId: 'root',
        path: '/Documents',
      },
      {
        id: '2',
        name: 'Images',
        type: 'folder',
        createdAt: new Date('2024-01-10'),
        modifiedAt: new Date('2024-01-25'),
        parentId: 'root',
        path: '/Images',
      },
      {
        id: '3',
        name: 'report.pdf',
        type: 'file',
        size: 2048576,
        mimeType: 'application/pdf',
        createdAt: new Date('2024-01-18'),
        modifiedAt: new Date('2024-01-18'),
        parentId: '1',
        path: '/Documents/report.pdf',
      },
      {
        id: '4',
        name: 'presentation.pptx',
        type: 'file',
        size: 5242880,
        mimeType: 'application/vnd.ms-powerpoint',
        createdAt: new Date('2024-01-20'),
        modifiedAt: new Date('2024-01-20'),
        parentId: '1',
        path: '/Documents/presentation.pptx',
      },
      {
        id: '5',
        name: 'photo1.jpg',
        type: 'file',
        size: 1024000,
        mimeType: 'image/jpeg',
        createdAt: new Date('2024-01-22'),
        modifiedAt: new Date('2024-01-22'),
        parentId: '2',
        path: '/Images/photo1.jpg',
      },
    ]);
  }

  canNavigateUp(): boolean {
    return this.currentFolderId() !== 'root';
  }

  navigateUp(): void {
    const currentFolder = this.files().find((f) => f.id === this.currentFolderId());
    if (currentFolder?.parentId) {
      this.currentFolderId.set(currentFolder.parentId);
    } else {
      this.currentFolderId.set('root');
    }
  }

  navigateToFolder(folderId: string): void {
    this.currentFolderId.set(folderId);
  }

  selectFile(file: FileItem): void {
    this.selectedFiles.set([file]);
  }

  openFile(file: FileItem): void {
    if (file.type === 'folder') {
      this.currentFolderId.set(file.id);
    } else {
      this.previewFile(file);
    }
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  uploadFiles(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      width: '600px',
      data: { currentFolderId: this.currentFolderId() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadFiles();
        this.snackBar.open('Files uploaded successfully', 'Close', { duration: 3000 });
      }
    });
  }

  createFolder(): void {
    const dialogRef = this.dialog.open(CreateFolderDialogComponent, {
      width: '400px',
      data: { currentFolderId: this.currentFolderId() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newFolder: FileItem = {
          id: Date.now().toString(),
          name: result.name,
          type: 'folder',
          createdAt: new Date(),
          modifiedAt: new Date(),
          parentId: this.currentFolderId(),
          path: `${this.getCurrentPath()}/${result.name}`,
        };
        this.files.update((files) => [...files, newFolder]);
        this.snackBar.open('Folder created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  previewFile(file: FileItem): void {
    const dialogRef = this.dialog.open(FileViewerDialogComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '1200px',
      data: { file },
    });
  }

  downloadFile(file: FileItem): void {
    this.snackBar.open(`Download: ${file.name}`, 'Close', { duration: 3000 });
  }

  shareFile(file: FileItem): void {
    this.snackBar.open(`Share: ${file.name}`, 'Close', { duration: 3000 });
  }

  deleteFile(file: FileItem): void {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      this.files.update((files) => files.filter((f) => f.id !== file.id));
      this.snackBar.open('File deleted successfully', 'Close', { duration: 3000 });
    }
  }

  getCurrentPath(): string {
    if (this.currentFolderId() === 'root') return '';
    const folder = this.files().find((f) => f.id === this.currentFolderId());
    return folder?.path || '';
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'movie';
    if (mimeType.startsWith('audio/')) return 'audiotrack';
    if (mimeType === 'application/pdf') return 'picture_as_pdf';
    if (mimeType.includes('word')) return 'description';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'table_chart';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'slideshow';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
