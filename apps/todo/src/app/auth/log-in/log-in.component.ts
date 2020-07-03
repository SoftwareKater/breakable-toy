import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthDialogOutput } from '../../shared/models/auth-dialog-output';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'skbt-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {

  @Output()
  public logInOutput = new EventEmitter<AuthDialogOutput>();

  public logInForm: FormGroup = this.fb.group({
    username: new FormControl('', []),
    password: new FormControl('', [Validators.required]),
  });

  private get username(): string {
    return this.logInForm.value.username;
  }

  private get password(): string {
    return this.logInForm.value.password;
  }

  private loginErrorNotification: MatSnackBarRef<SimpleSnackBar>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /** Validates the form and logs in the user */
  public async submit() {
    this.dismissLoginErrorNotificationIfPresent()
    if (this.logInForm.valid === true) {
      if (await this.validateCredentials()) {
        const formValues = { username: this.username, password: this.password };
        this.logInOutput.emit({
          type: 'log-in',
          action: 'submit',
          success: true,
          form: formValues,
        });
      } else {
        this.loginErrorNotification = this._snackBar.open('Incorrect username or password', '', {
          duration: 10e3,
          politeness: 'assertive'
          // horizontalPosition: 'center',
          // verticalPosition: 'top',
        });
      }
    }
  }

  /** Closes the dialog */
  public dismiss() {
    this.dismissLoginErrorNotificationIfPresent()
    this.logInOutput.emit({ type: 'log-in', action: 'dismiss' });
  }

  /** Closes the login error notification if it is present */
  private dismissLoginErrorNotificationIfPresent() {
    if (this.loginErrorNotification) {
      this.loginErrorNotification.dismiss()
      this.loginErrorNotification = null;
    }
  }

  private async validateCredentials(): Promise<boolean> {
    return await this.authService.login(this.username, this.password);
  }
}
