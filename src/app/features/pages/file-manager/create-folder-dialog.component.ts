import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-folder-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Create New Folder</h2>

    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Folder Name</mat-label>
        <input
          matInput
          [(ngModel)]="folderName"
          placeholder="Enter folder name"
          (keyup.enter)="create()"
          #nameInput
        />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="create()" [disabled]="!folderName.trim()">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }

      mat-dialog-content {
        min-width: 300px;
      }
    `,
  ],
})
export class CreateFolderDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateFolderDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  folderName = '';

  create(): void {
    if (this.folderName.trim()) {
      this.dialogRef.close({
        name: this.folderName.trim(),
        parentId: this.data.currentFolderId,
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
