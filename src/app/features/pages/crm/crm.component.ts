import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CustomerDialogComponent } from './customer-dialog.component';
import { LeadDialogComponent } from './lead-dialog.component';
import { TaskDialogComponent } from './task-dialog.component';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'prospect';
  lastContact: Date;
  totalValue: number;
  interactions: Interaction[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  probability: number;
  source: string;
  assignedTo: string;
  createdAt: Date;
  expectedClose: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'email' | 'meeting' | 'follow-up' | 'demo';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string;
  customerId?: string;
  leadId?: string;
  dueDate: Date;
  createdAt: Date;
}

export interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  notes: string;
  date: Date;
  duration?: number;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  attendees: string[];
  type: string;
}

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
})
export class CrmComponent {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  customers = signal<Customer[]>([]);
  leads = signal<Lead[]>([]);
  tasks = signal<Task[]>([]);
  appointments = signal<Appointment[]>([]);

  leadStages = [
    { key: 'new', label: 'New' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'proposal', label: 'Proposal' },
    { key: 'negotiation', label: 'Negotiation' },
    { key: 'closed-won', label: 'Closed Won' },
    { key: 'closed-lost', label: 'Closed Lost' },
  ];

  activeLeads = computed(() =>
    this.leads().filter((lead) => !['closed-won', 'closed-lost'].includes(lead.stage)),
  );

  pendingTasks = computed(() => this.tasks().filter((task) => task.status === 'pending'));

  totalPipelineValue = computed(() =>
    this.activeLeads().reduce((sum, lead) => sum + lead.value, 0),
  );

  upcomingAppointments = computed(() =>
    this.appointments()
      .filter((apt) => new Date(apt.date) > new Date())
      .slice(0, 5),
  );

  constructor() {
    this.loadMockData();
  }

  loadMockData(): void {
    this.customers.set([
      {
        id: '1',
        name: 'John Smith',
        email: 'john@company.com',
        phone: '+1-555-0123',
        company: 'Tech Corp',
        status: 'active',
        lastContact: new Date('2024-01-20'),
        totalValue: 50000,
        interactions: [],
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@startup.com',
        phone: '+1-555-0124',
        company: 'StartupXYZ',
        status: 'prospect',
        lastContact: new Date('2024-01-18'),
        totalValue: 25000,
        interactions: [],
      },
    ]);

    this.leads.set([
      {
        id: '1',
        name: 'Mike Wilson',
        email: 'mike@enterprise.com',
        company: 'Enterprise Inc',
        stage: 'qualified',
        value: 75000,
        probability: 60,
        source: 'Website',
        assignedTo: 'Sales Rep 1',
        createdAt: new Date('2024-01-15'),
        expectedClose: new Date('2024-02-15'),
      },
      {
        id: '2',
        name: 'Lisa Brown',
        email: 'lisa@business.com',
        company: 'Business Solutions',
        stage: 'proposal',
        value: 45000,
        probability: 80,
        source: 'Referral',
        assignedTo: 'Sales Rep 2',
        createdAt: new Date('2024-01-10'),
        expectedClose: new Date('2024-02-01'),
      },
    ]);

    this.tasks.set([
      {
        id: '1',
        title: 'Follow up with John Smith',
        description: 'Discuss contract renewal terms',
        type: 'call',
        priority: 'high',
        status: 'pending',
        assignedTo: 'Sales Rep 1',
        customerId: '1',
        dueDate: new Date('2024-01-25'),
        createdAt: new Date('2024-01-20'),
      },
      {
        id: '2',
        title: 'Send proposal to Enterprise Inc',
        description: 'Prepare and send detailed proposal',
        type: 'email',
        priority: 'urgent',
        status: 'in-progress',
        assignedTo: 'Sales Rep 1',
        leadId: '1',
        dueDate: new Date('2024-01-24'),
        createdAt: new Date('2024-01-22'),
      },
    ]);

    this.appointments.set([
      {
        id: '1',
        title: 'Product Demo - Enterprise Inc',
        description: 'Demonstrate key features and benefits',
        date: new Date('2024-01-26T10:00:00'),
        attendees: ['Mike Wilson', 'Sales Rep 1'],
        type: 'demo',
      },
      {
        id: '2',
        title: 'Contract Review Meeting',
        description: 'Review contract terms with legal team',
        date: new Date('2024-01-27T14:00:00'),
        attendees: ['John Smith', 'Legal Team'],
        type: 'meeting',
      },
    ]);
  }

  getLeadsByStage(stage: string): Lead[] {
    return this.leads().filter((lead) => lead.stage === stage);
  }

  addCustomer(): void {
    this.snackBar.open('Add Customer functionality coming soon', 'Close', { duration: 3000 });
  }

  viewCustomer(customer: Customer): void {
    this.snackBar.open(`Viewing ${customer.name}`, 'Close', { duration: 3000 });
  }

  editCustomer(customer: Customer): void {
    this.snackBar.open(`Editing ${customer.name}`, 'Close', { duration: 3000 });
  }

  addInteraction(customer: Customer): void {
    this.snackBar.open(`Add interaction for ${customer.name}`, 'Close', { duration: 3000 });
  }

  createTask(customer: Customer): void {
    this.snackBar.open(`Create task for ${customer.name}`, 'Close', { duration: 3000 });
  }

  addLead(): void {
    this.snackBar.open('Add Lead functionality coming soon', 'Close', { duration: 3000 });
  }

  editLead(lead: Lead): void {
    this.snackBar.open(`Editing ${lead.name}`, 'Close', { duration: 3000 });
  }

  convertLead(lead: Lead): void {
    this.snackBar.open(`Converting ${lead.name} to customer`, 'Close', { duration: 3000 });
  }

  addTask(): void {
    this.snackBar.open('Add Task functionality coming soon', 'Close', { duration: 3000 });
  }

  editTask(task: Task): void {
    this.snackBar.open(`Editing ${task.title}`, 'Close', { duration: 3000 });
  }

  completeTask(task: Task): void {
    task.status = 'completed';
    this.snackBar.open(`Task "${task.title}" completed`, 'Close', { duration: 3000 });
  }

  scheduleAppointment(): void {
    this.snackBar.open('Schedule Appointment functionality coming soon', 'Close', {
      duration: 3000,
    });
  }

  editAppointment(appointment: Appointment): void {
    this.snackBar.open(`Editing ${appointment.title}`, 'Close', { duration: 3000 });
  }

  cancelAppointment(appointment: Appointment): void {
    this.snackBar.open(`Cancelled ${appointment.title}`, 'Close', { duration: 3000 });
  }
}
