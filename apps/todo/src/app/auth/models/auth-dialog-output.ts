import { FormGroup } from '@angular/forms';
import { LogInForm } from './log-in-form';
import { SignUpForm } from './sign-up-form';

export interface AuthDialogOutput {
  type: 'log-in' | 'sign-up';
  action: 'submit' | 'dismiss';
  form?: LogInForm | SignUpForm;
}
