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
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-lead-dialog',
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
    MatSliderModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Lead' : 'Add Lead' }}</h2>

    <form [formGroup]="leadForm" (ngSubmit)="save()">
      <mat-dialog-content>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Contact Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter contact name" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Enter email" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Company</mat-label>
            <input matInput formControlName="company" placeholder="Enter company name" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Stage</mat-label>
            <mat-select formControlName="stage">
              <mat-option value="new">New</mat-option>
              <mat-option value="qualified">Qualified</mat-option>
              <mat-option value="proposal">Proposal</mat-option>
              <mat-option value="negotiation">Negotiation</mat-option>
              <mat-option value="closed-won">Closed Won</mat-option>
              <mat-option value="closed-lost">Closed Lost</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Deal Value</mat-label>
            <input matInput type="number" formControlName="value" placeholder="0" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Source</mat-label>
            <mat-select formControlName="source">
              <mat-option value="Website">Website</mat-option>
              <mat-option value="Referral">Referral</mat-option>
              <mat-option value="Cold Call">Cold Call</mat-option>
              <mat-option value="Social Media">Social Media</mat-option>
              <mat-option value="Trade Show">Trade Show</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Assigned To</mat-label>
            <mat-select formControlName="assignedTo">
              <mat-option value="Sales Rep 1">Sales Rep 1</mat-option>
              <mat-option value="Sales Rep 2">Sales Rep 2</mat-option>
              <mat-option value="Sales Manager">Sales Manager</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Expected Close Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="expectedClose" />
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <div class="probability-field">
            <label>Probability: {{ leadForm.get('probability')?.value }}%</label>
            <mat-slider min="0" max="100" step="5" formControlName="probability"> </mat-slider>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="leadForm.invalid">
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
        min-width: 600px;
      }

      mat-form-field {
        width: 100%;
      }

      .probability-field {
        grid-column: span 2;
        padding: 16px 0;
      }

      .probability-field label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
      }
    `,
  ],
})
export class LeadDialogComponent {
  private dialogRef = inject(MatDialogRef<LeadDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  leadForm: FormGroup;

  constructor() {
    this.leadForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      company: [this.data?.company || '', Validators.required],
      stage: [this.data?.stage || 'new', Validators.required],
      value: [this.data?.value || 0, [Validators.required, Validators.min(0)]],
      probability: [
        this.data?.probability || 50,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      source: [this.data?.source || 'Website', Validators.required],
      assignedTo: [this.data?.assignedTo || 'Sales Rep 1', Validators.required],
      expectedClose: [this.data?.expectedClose || new Date(), Validators.required],
    });
  }

  save(): void {
    if (this.leadForm.valid) {
      this.dialogRef.close(this.leadForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
