import { Injectable, inject, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatDialog } from '@angular/material/dialog';
import { PwaInstallDialogComponent } from '../components/pwa-install-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private swUpdate = inject(SwUpdate);
  private dialog = inject(MatDialog);

  private deferredPrompt: any = null;
  canInstall = signal(false);
  private hasPromptedBefore = signal(false);

  constructor() {
    this.checkPreviousPrompt();
    this.listenForInstallPrompt();
    this.checkForUpdates();
  }

  private checkPreviousPrompt(): void {
    const hasPrompted = localStorage.getItem('pwa-install-prompted');
    const isInstalled = localStorage.getItem('pwa-installed');

    if (hasPrompted || isInstalled) {
      this.hasPromptedBefore.set(true);
    }
  }

  private listenForInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.canInstall.set(true);

      if (!this.hasPromptedBefore()) {
        this.showInstallDialog();
      }
    });
  }

  private showInstallDialog(): void {
    setTimeout(() => {
      localStorage.setItem('pwa-install-prompted', 'true');
      this.hasPromptedBefore.set(true);

      this.dialog.open(PwaInstallDialogComponent, {
        width: '400px',
        disableClose: false,
      });
    }, 3000); // Show after 3 seconds
  }

  async installApp(): Promise<void> {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
      this.canInstall.set(false);
    }

    this.deferredPrompt = null;
  }

  showInstallPrompt(): void {
    if (this.canInstall()) {
      this.dialog.open(PwaInstallDialogComponent, {
        width: '400px',
        disableClose: false,
      });
    }
  }

  private checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event) => {
        if (event.type === 'VERSION_READY') {
          localStorage.removeItem('pwa-install-prompted');
          this.hasPromptedBefore.set(false);

          if (confirm('New version available. Load new version?')) {
            window.location.reload();
          }
        }
      });
    }
  }
}
