import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthDialogOutput } from '../models/auth-dialog-output';

@Component({
  selector: 'skbt-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
})
export class AuthDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AuthDialogComponent>) {}

  ngOnInit(): void {}

  public onDialogOutput(event: AuthDialogOutput) {
    if (event.action === 'dismiss' || !event.form) {
      this.dialogRef.close(null);
    } else {
      if (event.type === 'log-in') {
        
      }
      this.dialogRef.close(event.form);
    }
  }
}
