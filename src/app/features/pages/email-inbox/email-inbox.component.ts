import { Component, signal, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  selected?: boolean;
}

@Component({
  selector: 'app-email-inbox',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule,
  ],
  templateUrl: './email-inbox.component.html',
  styleUrl: './email-inbox.component.scss',
})
export class EmailInboxComponent {
  currentView = signal('inbox');
  selectedEmail = signal<Email | null>(null);
  isComposing = signal(false);

  inboxEmails = signal<Email[]>([
    {
      id: 1,
      from: 'John Smith <john.smith@techcorp.com>',
      to: 'admin@company.com',
      subject: 'Q4 Project Milestone Review',
      body: 'Hi Team,\n\nI wanted to provide an update on our Q4 project milestones. We have successfully completed 85% of the planned deliverables and are on track to meet our December deadline.\n\nKey achievements:\n- User authentication system implemented\n- Database optimization completed\n- API endpoints finalized\n\nNext steps:\n- UI/UX final review\n- Performance testing\n- Security audit\n\nPlease let me know if you have any questions.\n\nBest regards,\nJohn',
      date: '2024-01-15 10:30',
      read: false,
      starred: true,
    },
    {
      id: 2,
      from: 'Sarah Johnson <sarah.j@marketing.com>',
      to: 'admin@company.com',
      subject: 'Marketing Campaign Results & Next Quarter Planning',
      body: 'Hello,\n\nI hope this email finds you well. I wanted to share the results from our recent marketing campaign and discuss plans for next quarter.\n\nCampaign Results:\n- 25% increase in lead generation\n- 18% improvement in conversion rates\n- ROI of 340%\n\nFor next quarter, I propose we focus on:\n1. Social media expansion\n2. Content marketing strategy\n3. Influencer partnerships\n\nWould you be available for a meeting next week to discuss this further?\n\nThanks,\nSarah',
      date: '2024-01-15 09:15',
      read: true,
      starred: false,
    },
    {
      id: 3,
      from: 'Mike Chen <mike.chen@devteam.com>',
      to: 'admin@company.com',
      subject: 'Critical Bug Report - Payment Gateway Issue',
      body: 'URGENT: Payment Gateway Issue\n\nWe have identified a critical bug in the payment processing system that is affecting approximately 3% of transactions.\n\nIssue Details:\n- Error occurs during checkout process\n- Affects credit card payments only\n- PayPal and bank transfers working normally\n\nImmediate Actions Taken:\n- Temporary workaround implemented\n- Monitoring increased\n- Payment provider contacted\n\nEstimated fix time: 2-4 hours\n\nI will keep you updated on the progress.\n\nMike Chen\nSenior Developer',
      date: '2024-01-14 16:45',
      read: false,
      starred: false,
    },
    {
      id: 4,
      from: 'Lisa Wang <lisa.wang@hr.company.com>',
      to: 'admin@company.com',
      subject: 'New Employee Onboarding Schedule',
      body: 'Hi,\n\nI wanted to share the onboarding schedule for our new team members joining next week.\n\nNew Hires:\n- Alex Rodriguez (Frontend Developer)\n- Emma Thompson (UX Designer)\n- David Kim (Data Analyst)\n\nSchedule:\nMonday: Orientation and paperwork\nTuesday: Department introductions\nWednesday: System access and training\nThursday: Project assignments\nFriday: Team lunch and Q&A\n\nPlease let me know if you would like to be involved in any of these sessions.\n\nBest,\nLisa',
      date: '2024-01-14 14:20',
      read: true,
      starred: false,
    },
  ]);

  sentEmails = signal<Email[]>([
    {
      id: 5,
      from: 'admin@company.com',
      to: 'team@company.com',
      subject: 'Weekly Team Update - January 15th',
      body: 'Team,\n\nHere is our weekly update for the week ending January 15th:\n\nAccomplishments:\n- Successfully deployed version 2.1.0\n- Completed security audit\n- Onboarded 3 new team members\n\nUpcoming Priorities:\n- Q4 project milestone review\n- Performance optimization\n- Client presentation preparation\n\nMetrics:\n- System uptime: 99.9%\n- Customer satisfaction: 4.8/5\n- Bug resolution time: 2.3 hours average\n\nHave a great week!\n\nAdmin Team',
      date: '2024-01-14 14:20',
      read: true,
      starred: false,
    },
    {
      id: 6,
      from: 'admin@company.com',
      to: 'clients@company.com',
      subject: 'System Maintenance Notification',
      body: 'Dear Valued Clients,\n\nWe will be performing scheduled system maintenance on Sunday, January 21st from 2:00 AM to 6:00 AM EST.\n\nDuring this time:\n- System will be temporarily unavailable\n- No data will be lost\n- All services will resume automatically\n\nWe apologize for any inconvenience and appreciate your understanding.\n\nBest regards,\nTechnical Team',
      date: '2024-01-13 16:30',
      read: true,
      starred: false,
    },
  ]);

  drafts = signal<Email[]>([
    {
      id: 7,
      from: 'admin@company.com',
      to: 'board@company.com',
      subject: 'Q4 Financial Report - Draft',
      body: 'Dear Board Members,\n\nI am preparing the Q4 financial report and wanted to share some preliminary findings:\n\nRevenue: $2.4M (15% increase)\nExpenses: $1.8M\nNet Profit: $600K\n\n[Draft - Need to add detailed breakdown and charts]',
      date: '2024-01-14 12:00',
      read: false,
      starred: false,
    },
  ]);

  binEmails = signal<Email[]>([]);

  folders = signal([
    { name: 'inbox', label: 'Inbox', icon: 'inbox', count: 3 },
    { name: 'sent', label: 'Sent', icon: 'send', count: 2 },
    { name: 'drafts', label: 'Drafts', icon: 'drafts', count: 1 },
    { name: 'bin', label: 'Trash', icon: 'delete', count: 0 },
  ]);

  searchQuery = signal('');
  selectedEmails = signal<number[]>([]);

  private fb = inject(FormBuilder);

  composeForm = this.fb.group({
    to: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    body: ['', Validators.required],
  });

  selectFolder(folder: string): void {
    this.currentView.set(folder);
    this.selectedEmail.set(null);
    this.isComposing.set(false);
  }

  getCurrentEmails(): Email[] {
    const view = this.currentView();
    switch (view) {
      case 'inbox':
        return this.inboxEmails();
      case 'sent':
        return this.sentEmails();
      case 'drafts':
        return this.drafts();
      case 'bin':
        return this.binEmails();
      default:
        return [];
    }
  }

  selectEmail(email: Email): void {
    this.selectedEmail.set(email);
    if (!email.read && this.currentView() === 'inbox') {
      this.markAsRead(email);
    }
  }

  markAsRead(email: Email): void {
    if (this.currentView() === 'inbox') {
      this.inboxEmails.update((emails) =>
        emails.map((e) => (e.id === email.id ? { ...e, read: true } : e)),
      );
      this.updateFolderCount('inbox');
    }
  }

  toggleStar(email: Email): void {
    const view = this.currentView();
    if (view === 'inbox') {
      this.inboxEmails.update((emails) =>
        emails.map((e) => (e.id === email.id ? { ...e, starred: !e.starred } : e)),
      );
    }
  }

  deleteEmail(email: Email): void {
    const view = this.currentView();
    if (view === 'inbox') {
      this.inboxEmails.update((emails) => emails.filter((e) => e.id !== email.id));
      this.binEmails.update((emails) => [...emails, email]);
    } else if (view === 'sent') {
      this.sentEmails.update((emails) => emails.filter((e) => e.id !== email.id));
      this.binEmails.update((emails) => [...emails, email]);
    }
    this.updateFolderCount(view);
    this.updateFolderCount('bin');
    this.selectedEmail.set(null);
  }

  composeEmail(): void {
    this.isComposing.set(true);
    this.selectedEmail.set(null);
    this.composeForm.reset();
  }

  sendEmail(): void {
    if (this.composeForm.valid) {
      const newEmail: Email = {
        id: Date.now(),
        from: 'admin@company.com',
        to: this.composeForm.value.to || '',
        subject: this.composeForm.value.subject || '',
        body: this.composeForm.value.body || '',
        date: new Date().toLocaleString(),
        read: true,
        starred: false,
      };

      this.sentEmails.update((emails) => [newEmail, ...emails]);
      this.updateFolderCount('sent');
      this.isComposing.set(false);
      this.composeForm.reset();
    }
  }

  saveDraft(): void {
    if (this.composeForm.value.subject || this.composeForm.value.body) {
      const draft: Email = {
        id: Date.now(),
        from: 'admin@company.com',
        to: this.composeForm.value.to || '',
        subject: this.composeForm.value.subject || 'Draft',
        body: this.composeForm.value.body || '',
        date: new Date().toLocaleString(),
        read: false,
        starred: false,
      };

      this.drafts.update((emails) => [draft, ...emails]);
      this.updateFolderCount('drafts');
      this.isComposing.set(false);
      this.composeForm.reset();
    }
  }

  getCurrentFolderLabel(): string {
    return this.folders().find((f) => f.name === this.currentView())?.label || 'Emails';
  }

  searchEmails(): void {
    // Search functionality would be implemented here
  }

  toggleEmailSelection(emailId: number): void {
    this.selectedEmails.update((selected) => {
      const index = selected.indexOf(emailId);
      if (index > -1) {
        return selected.filter((id) => id !== emailId);
      } else {
        return [...selected, emailId];
      }
    });
  }

  selectAllEmails(): void {
    const currentEmails = this.getCurrentEmails();
    this.selectedEmails.set(currentEmails.map((email) => email.id));
  }

  clearSelection(): void {
    this.selectedEmails.set([]);
  }

  getEmailPreview(body: string): string {
    return body.length > 100 ? body.substring(0, 100) + '...' : body;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  getEmailInitials(email: string): string {
    const match = email.match(/^([^<]+)</);
    const name = match ? match[1].trim() : email;
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getEmailAddress(email: string): string {
    const match = email.match(/<(.+)>/);
    return match ? match[1] : email;
  }

  private updateFolderCount(folderName: string): void {
    this.folders.update((folders) =>
      folders.map((folder) => {
        if (folder.name === folderName) {
          let count = 0;
          switch (folderName) {
            case 'inbox':
              count = this.inboxEmails().filter((e) => !e.read).length;
              break;
            case 'sent':
              count = this.sentEmails().length;
              break;
            case 'drafts':
              count = this.drafts().length;
              break;
            case 'bin':
              count = this.binEmails().length;
              break;
          }
          return { ...folder, count };
        }
        return folder;
      }),
    );
  }
}
