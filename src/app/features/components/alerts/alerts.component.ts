import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  alerts = signal([
    { type: 'success', message: 'Operation completed successfully!', icon: 'check_circle' },
    { type: 'warning', message: 'Please review your settings before proceeding.', icon: 'warning' },
    { type: 'error', message: 'An error occurred while processing your request.', icon: 'error' },
    { type: 'info', message: 'New updates are available for your dashboard.', icon: 'info' },
  ]);

  showSnackbar(message: string, type: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`snackbar-${type}`],
    });
  }

  showDialog() {
    this.dialog.open(ConfirmDialogComponent);
  }

  dismissAlert(index: number) {
    this.alerts.update((current) => current.filter((_, i) => i !== index));
  }
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Action</h2>
    <mat-dialog-content>
      <p>Are you sure you want to proceed with this action?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" mat-dialog-close="true">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {}
