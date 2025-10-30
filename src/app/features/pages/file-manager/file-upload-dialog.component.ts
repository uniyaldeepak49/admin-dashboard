import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

@Component({
  selector: 'app-file-upload-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatListModule,
    MatDividerModule,
  ],
  template: `
    <h2 mat-dialog-title>Upload Files</h2>

    <mat-dialog-content>
      <div
        class="upload-area"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        [class.drag-over]="isDragOver()"
      >
        <mat-icon>cloud_upload</mat-icon>
        <p>Drag and drop files here or click to browse</p>
        <input
          type="file"
          #fileInput
          multiple
          (change)="onFileSelected($event)"
          style="display: none;"
        />
        <button mat-raised-button color="primary" (click)="fileInput.click()">Browse Files</button>
      </div>

      @if (uploadFiles().length > 0) {
        <div class="file-list">
          <h3>Files to Upload</h3>
          <mat-list>
            @for (uploadFile of uploadFiles(); track uploadFile.file.name) {
              <mat-list-item>
                <mat-icon matListItemIcon>
                  @switch (uploadFile.status) {
                    @case ('pending') {
                      insert_drive_file
                    }
                    @case ('uploading') {
                      cloud_upload
                    }
                    @case ('completed') {
                      check_circle
                    }
                    @case ('error') {
                      error
                    }
                  }
                </mat-icon>
                <div matListItemTitle>{{ uploadFile.file.name }}</div>
                <div matListItemLine>
                  {{ formatFileSize(uploadFile.file.size) }}
                  @if (uploadFile.status === 'uploading') {
                    - {{ uploadFile.progress }}%
                  }
                </div>
                @if (uploadFile.status === 'uploading') {
                  <mat-progress-bar
                    mode="determinate"
                    [value]="uploadFile.progress"
                  ></mat-progress-bar>
                }
                <button
                  mat-icon-button
                  (click)="removeFile(uploadFile)"
                  [disabled]="uploadFile.status === 'uploading'"
                >
                  <mat-icon>close</mat-icon>
                </button>
              </mat-list-item>
              <mat-divider></mat-divider>
            }
          </mat-list>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="startUpload()"
        [disabled]="uploadFiles().length === 0 || isUploading()"
      >
        Upload {{ uploadFiles().length }} Files
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .upload-area {
        border: 2px dashed #ccc;
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        margin-bottom: 20px;
        transition: border-color 0.3s;
        cursor: pointer;
      }

      .upload-area:hover,
      .upload-area.drag-over {
        border-color: #2196f3;
        background-color: rgba(33, 150, 243, 0.05);
      }

      .upload-area mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #666;
        margin-bottom: 16px;
      }

      .file-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .file-list h3 {
        margin: 0 0 16px 0;
        color: #333;
      }

      mat-progress-bar {
        margin-top: 8px;
      }
    `,
  ],
})
export class FileUploadDialogComponent {
  private dialogRef = inject(MatDialogRef<FileUploadDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  uploadFiles = signal<UploadFile[]>([]);
  isDragOver = signal(false);
  isUploading = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);

    const files = Array.from(event.dataTransfer?.files || []);
    this.addFiles(files);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.addFiles(files);
  }

  addFiles(files: File[]): void {
    const newUploadFiles = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    this.uploadFiles.update((current) => [...current, ...newUploadFiles]);
  }

  removeFile(uploadFile: UploadFile): void {
    this.uploadFiles.update((files) => files.filter((f) => f !== uploadFile));
  }

  startUpload(): void {
    this.isUploading.set(true);

    // Simulate upload progress
    this.uploadFiles().forEach((uploadFile, index) => {
      uploadFile.status = 'uploading';

      const interval = setInterval(
        () => {
          uploadFile.progress += 10;

          if (uploadFile.progress >= 100) {
            uploadFile.status = 'completed';
            uploadFile.progress = 100;
            clearInterval(interval);

            // Check if all uploads are complete
            const allComplete = this.uploadFiles().every((f) => f.status === 'completed');
            if (allComplete) {
              this.isUploading.set(false);
              setTimeout(() => this.dialogRef.close(true), 1000);
            }
          }
        },
        200 + index * 100,
      ); // Stagger uploads
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
