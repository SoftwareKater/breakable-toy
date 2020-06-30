import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthDialogOutput } from '../../shared/models/auth-dialog-output';

@Component({
  selector: 'skbt-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  @Output()
  logInOutput = new EventEmitter<AuthDialogOutput>();

  logInForm: FormGroup = this.fb.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get username(): string {
    return this.logInForm.value.username;
  }

  get password(): string {
    return this.logInForm.value.password;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {}

  /** Validates the form and logs in the user */
  public async submit() {
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
        console.log('Incorrect username or password'); // display this as a warning!
      }
    }
  }

  /** Closes the dialog */
  public dismiss() {
    this.logInOutput.emit({ type: 'log-in', action: 'dismiss' });
  }

  private async validateCredentials(): Promise<boolean> {
    return await this.authService.login(this.username, this.password);
  }
}
