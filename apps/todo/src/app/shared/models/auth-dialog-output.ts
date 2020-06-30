import { CreateUser } from '@breakable-toy/shared/data-access/user-api-client';
import { Credentials } from '@breakable-toy/shared/data-access/auth-api-client';

export interface AuthDialogOutput {
  type: 'log-in' | 'sign-up';
  action: 'submit' | 'dismiss';
  success?: boolean;
  form?: Credentials | CreateUser;
}
