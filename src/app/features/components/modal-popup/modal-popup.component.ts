import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-popup',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './modal-popup.component.html',
  styleUrl: './modal-popup.component.scss',
})
export class ModalPopupComponent {
  private dialog = inject(MatDialog);

  openBasicDialog() {
    this.dialog.open(BasicDialogComponent, {
      width: '400px',
    });
  }

  openConfirmDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
    });
  }

  openFormDialog() {
    this.dialog.open(FormDialogComponent, {
      width: '500px',
    });
  }

  openFullscreenDialog() {
    this.dialog.open(FullscreenDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }
}

@Component({
  selector: 'app-basic-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Basic Dialog</h2>
    <mat-dialog-content>
      <p>This is a basic dialog example with simple content.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class BasicDialogComponent {}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>warning</mat-icon>
      Confirm Action
    </h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this item? This action cannot be undone.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" mat-dialog-close="true">Delete</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {}

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Add New User</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="userForm.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: ['.full-width { width: 100%; margin-bottom: 16px; }'],
})
export class FormDialogComponent {
  private fb = inject(FormBuilder);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
}

@Component({
  selector: 'app-fullscreen-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      Fullscreen Dialog
      <button mat-icon-button mat-dialog-close style="float: right;">
        <mat-icon>close</mat-icon>
      </button>
    </h2>
    <mat-dialog-content>
      <p>This is a fullscreen dialog that covers the entire viewport.</p>
      <p>It's useful for complex forms or detailed content that needs more space.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>Done</button>
    </mat-dialog-actions>
  `,
})
export class FullscreenDialogComponent {}
