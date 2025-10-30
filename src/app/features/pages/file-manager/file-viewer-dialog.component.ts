import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FileItem, FileVersion } from './file-manager.component';

@Component({
  selector: 'app-file-viewer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
  ],
  template: `
    <div class="file-viewer-header">
      <h2 mat-dialog-title>{{ file.name }}</h2>
      <div class="header-actions">
        <button mat-icon-button (click)="downloadFile()">
          <mat-icon>download</mat-icon>
        </button>
        <button mat-icon-button (click)="shareFile()">
          <mat-icon>share</mat-icon>
        </button>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>

    <mat-dialog-content>
      <mat-tab-group>
        <mat-tab label="Preview">
          <div class="preview-container">
            @switch (getFileType(file.mimeType || '')) {
              @case ('image') {
                <img [src]="getPreviewUrl()" [alt]="file.name" class="preview-image" />
              }
              @case ('pdf') {
                <iframe [src]="getPreviewUrl()" class="preview-iframe"></iframe>
              }
              @case ('text') {
                <div class="text-preview">
                  <pre>{{ getTextContent() }}</pre>
                </div>
              }
              @default {
                <div class="no-preview">
                  <mat-icon>insert_drive_file</mat-icon>
                  <h3>No preview available</h3>
                  <p>This file type cannot be previewed</p>
                  <button mat-raised-button color="primary" (click)="downloadFile()">
                    <mat-icon>download</mat-icon>
                    Download File
                  </button>
                </div>
              }
            }
          </div>
        </mat-tab>

        <mat-tab label="Details">
          <div class="details-container">
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>insert_drive_file</mat-icon>
                <div matListItemTitle>File Name</div>
                <div matListItemLine>{{ file.name }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>

              <mat-list-item>
                <mat-icon matListItemIcon>folder</mat-icon>
                <div matListItemTitle>Location</div>
                <div matListItemLine>{{ file.path }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>

              <mat-list-item>
                <mat-icon matListItemIcon>storage</mat-icon>
                <div matListItemTitle>Size</div>
                <div matListItemLine>{{ formatFileSize(file.size || 0) }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>

              <mat-list-item>
                <mat-icon matListItemIcon>schedule</mat-icon>
                <div matListItemTitle>Created</div>
                <div matListItemLine>{{ file.createdAt | date: 'medium' }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>

              <mat-list-item>
                <mat-icon matListItemIcon>update</mat-icon>
                <div matListItemTitle>Modified</div>
                <div matListItemLine>{{ file.modifiedAt | date: 'medium' }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>

              <mat-list-item>
                <mat-icon matListItemIcon>info</mat-icon>
                <div matListItemTitle>Type</div>
                <div matListItemLine>{{ file.mimeType || 'Unknown' }}</div>
              </mat-list-item>
            </mat-list>

            @if (file.tags && file.tags.length > 0) {
              <div class="tags-section">
                <h3>Tags</h3>
                <mat-chip-set>
                  @for (tag of file.tags; track tag) {
                    <mat-chip>{{ tag }}</mat-chip>
                  }
                </mat-chip-set>
              </div>
            }
          </div>
        </mat-tab>

        <mat-tab label="Versions">
          <div class="versions-container">
            @if (file.versions && file.versions.length > 0) {
              <mat-list>
                @for (version of file.versions; track version.id) {
                  <mat-list-item>
                    <mat-icon matListItemIcon>history</mat-icon>
                    <div matListItemTitle>Version {{ version.version }}</div>
                    <div matListItemLine>
                      {{ version.createdAt | date: 'medium' }} by {{ version.createdBy }} •
                      {{ formatFileSize(version.size) }}
                    </div>
                    <button mat-icon-button (click)="downloadVersion(version)">
                      <mat-icon>download</mat-icon>
                    </button>
                  </mat-list-item>
                  <mat-divider></mat-divider>
                }
              </mat-list>
            } @else {
              <div class="no-versions">
                <mat-icon>history</mat-icon>
                <h3>No version history</h3>
                <p>This file has no previous versions</p>
              </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
  `,
  styles: [
    `
      .file-viewer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px 0;
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }

      .preview-container {
        padding: 16px;
        min-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .preview-image {
        max-width: 100%;
        max-height: 500px;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .preview-iframe {
        width: 100%;
        height: 500px;
        border: none;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .text-preview {
        width: 100%;
        max-height: 500px;
        overflow: auto;
        background: #f5f5f5;
        border-radius: 8px;
        padding: 16px;
      }

      .text-preview pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
      }

      .no-preview,
      .no-versions {
        text-align: center;
        padding: 64px 16px;
        color: #666;
      }

      .no-preview mat-icon,
      .no-versions mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      .details-container,
      .versions-container {
        padding: 16px;
      }

      .tags-section {
        margin-top: 24px;
      }

      .tags-section h3 {
        margin: 0 0 16px 0;
        color: #333;
      }

      mat-dialog-content {
        padding: 0;
        margin: 0;
      }
    `,
  ],
})
export class FileViewerDialogComponent {
  private dialogRef = inject(MatDialogRef<FileViewerDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  file: FileItem = this.data.file;

  getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('text/')) return 'text';
    return 'unknown';
  }

  getPreviewUrl(): string {
    // For demo purposes, return placeholder URLs
    const fileType = this.getFileType(this.file.mimeType || '');

    switch (fileType) {
      case 'image':
        return 'https://picsum.photos/800/600';
      case 'pdf':
        return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      default:
        return '';
    }
  }

  getTextContent(): string {
    // Mock text content for demo
    return `This is a sample text file content for ${this.file.name}.
    
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Sample code:
function hello() {
  console.log("Hello, World!");
}`;
  }

  downloadFile(): void {
    // Implement download functionality
    console.log('Downloading file:', this.file.name);
  }

  shareFile(): void {
    // Implement share functionality
    console.log('Sharing file:', this.file.name);
  }

  downloadVersion(version: any): void {
    // Implement version download
    console.log('Downloading version:', version.version);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
