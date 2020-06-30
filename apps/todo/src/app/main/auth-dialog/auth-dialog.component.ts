import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthDialogOutput } from '../../shared/models/auth-dialog-output';

@Component({
  selector: 'skbt-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
})
export class AuthDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AuthDialogComponent>) {}

  ngOnInit(): void {}

  public onDialogOutput(event: AuthDialogOutput) {
    if (event.action === 'dismiss' || !event.success || !event.form) {
      console.log('Dismissed dialog, or unsuccessful login/signup, or form was missing');
      this.dialogRef.close(null);
    } else {
      if (event.type === 'log-in') {
        console.log('Successfully logged in');
        this.dialogRef.close(event.form);
      }
      if (event.type === 'sign-up') {
        console.log('Successfully signed up');
        this.dialogRef.close(event.form);
      }
    }
  }
}
