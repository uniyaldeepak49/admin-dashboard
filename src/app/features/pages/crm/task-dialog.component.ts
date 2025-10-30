import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Task' : 'Add Task' }}</h2>

    <form [formGroup]="taskForm" (ngSubmit)="save()">
      <mat-dialog-content>
        <div class="form-container">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Task Title</mat-label>
            <input matInput formControlName="title" placeholder="Enter task title" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea
              matInput
              rows="3"
              formControlName="description"
              placeholder="Enter task description"
            ></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="call">Call</mat-option>
                <mat-option value="email">Email</mat-option>
                <mat-option value="meeting">Meeting</mat-option>
                <mat-option value="follow-up">Follow-up</mat-option>
                <mat-option value="demo">Demo</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
                <mat-option value="urgent">Urgent</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="in-progress">In Progress</mat-option>
                <mat-option value="completed">Completed</mat-option>
                <mat-option value="cancelled">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Assigned To</mat-label>
              <mat-select formControlName="assignedTo">
                <mat-option value="Sales Rep 1">Sales Rep 1</mat-option>
                <mat-option value="Sales Rep 2">Sales Rep 2</mat-option>
                <mat-option value="Sales Manager">Sales Manager</mat-option>
                <mat-option value="Customer Success">Customer Success</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Due Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate" />
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid">
          {{ this.data ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .form-container {
        min-width: 500px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class TaskDialogComponent {
  private dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  taskForm: FormGroup;

  constructor() {
    this.taskForm = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      description: [this.data?.description || ''],
      type: [this.data?.type || 'call', Validators.required],
      priority: [this.data?.priority || 'medium', Validators.required],
      status: [this.data?.status || 'pending', Validators.required],
      assignedTo: [this.data?.assignedTo || 'Sales Rep 1', Validators.required],
      dueDate: [this.data?.dueDate || new Date(), Validators.required],
    });
  }

  save(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close({
        ...this.taskForm.value,
        id: this.data?.id || Date.now().toString(),
        createdAt: this.data?.createdAt || new Date(),
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
