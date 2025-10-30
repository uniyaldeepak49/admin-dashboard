import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PwaService } from '../services/pwa.service';

@Component({
  selector: 'app-pwa-install-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="install-dialog">
      <div class="dialog-header">
        <mat-icon class="app-icon">dashboard</mat-icon>
        <h2 mat-dialog-title>Install Admin Dashboard</h2>
      </div>

      <div mat-dialog-content>
        <p>Install our app for a better experience:</p>
        <ul>
          <li>Faster loading times</li>
          <li>Offline access</li>
          <li>Native app experience</li>
          <li>Push notifications</li>
        </ul>
      </div>

      <div mat-dialog-actions>
        <button mat-button (click)="dismiss()">Not Now</button>
        <button mat-raised-button color="primary" (click)="install()">
          <mat-icon>download</mat-icon>
          Install App
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .install-dialog {
        text-align: center;
      }

      .dialog-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .app-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #3b82f6;
      }

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }

      ul {
        text-align: left;
        margin: 16px 0;
      }

      li {
        margin: 8px 0;
      }

      [mat-dialog-actions] {
        justify-content: space-between;
        padding: 16px 0 0 0;
      }
    `,
  ],
})
export class PwaInstallDialogComponent {
  private dialogRef = inject(MatDialogRef<PwaInstallDialogComponent>);
  private pwaService = inject(PwaService);

  async install(): Promise<void> {
    try {
      await this.pwaService.installApp();
      this.dialogRef.close();
    } catch (error) {
      console.error('PWA installation failed:', error);
      this.dialogRef.close();
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }
}
