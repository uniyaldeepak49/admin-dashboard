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
  selector: 'app-customer-dialog',
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
    <h2 mat-dialog-title>{{ data ? 'Edit Customer' : 'Add Customer' }}</h2>

    <form [formGroup]="customerForm" (ngSubmit)="save()">
      <mat-dialog-content>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter full name" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Enter email" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" placeholder="Enter phone number" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Company</mat-label>
            <input matInput formControlName="company" placeholder="Enter company name" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="active">Active</mat-option>
              <mat-option value="inactive">Inactive</mat-option>
              <mat-option value="prospect">Prospect</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Total Value</mat-label>
            <input matInput type="number" formControlName="totalValue" placeholder="0" />
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="customerForm.invalid">
          {{ data ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        min-width: 500px;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class CustomerDialogComponent {
  private dialogRef = inject(MatDialogRef<CustomerDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  customerForm: FormGroup;

  constructor() {
    this.customerForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phone: [this.data?.phone || '', Validators.required],
      company: [this.data?.company || '', Validators.required],
      status: [this.data?.status || 'prospect', Validators.required],
      totalValue: [this.data?.totalValue || 0, [Validators.required, Validators.min(0)]],
    });
  }

  save(): void {
    if (this.customerForm.valid) {
      this.dialogRef.close(this.customerForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
