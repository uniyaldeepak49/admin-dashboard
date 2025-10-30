import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  uploaded: boolean;
}

@Component({
  selector: 'app-file-uploads',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatListModule,
  ],
  templateUrl: './file-uploads.component.html',
  styleUrl: './file-uploads.component.scss',
})
export class FileUploadsComponent {
  uploadedFiles = signal<UploadedFile[]>([]);
  dragOver = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);

    if (event.dataTransfer?.files) {
      this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
  }

  private processFiles(files: File[]) {
    files.forEach((file) => {
      const uploadFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        uploaded: false,
      };

      this.uploadedFiles.update((files) => [...files, uploadFile]);
      this.simulateUpload(uploadFile);
    });
  }

  private simulateUpload(file: UploadedFile) {
    const interval = setInterval(() => {
      file.progress += Math.random() * 20;

      if (file.progress >= 100) {
        file.progress = 100;
        file.uploaded = true;
        clearInterval(interval);
      }

      this.uploadedFiles.update((files) => [...files]);
    }, 200);
  }

  removeFile(fileToRemove: UploadedFile) {
    this.uploadedFiles.update((files) => files.filter((file) => file !== fileToRemove));
  }

  clearAllFiles() {
    this.uploadedFiles.set([]);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(type: string): string {
    if (type.startsWith('image/')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word')) return 'description';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'table_chart';
    return 'insert_drive_file';
  }
}
