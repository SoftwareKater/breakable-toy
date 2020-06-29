import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AuthDialogOutput } from '../../shared/models/auth-dialog-output';
import { CreateUser } from '@breakable-toy/shared/data-access/user-api-client';
import { UserService } from '../user.service';

@Component({
  selector: 'skbt-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @Output()
  signUpOutput = new EventEmitter<AuthDialogOutput>();

  signUpForm: FormGroup = this.fb.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    alias: new FormControl(),
    email: new FormControl('', [Validators.email]),
  });

  hide = true;

  get username() {
    return this.signUpForm.value.username;
  }

  get password() {
    return this.signUpForm.value.password;
  }

  get passwordInput() {
    return this.signUpForm.get('password');
  }

  get alias() {
    return this.signUpForm.value.alias;
  }

  get email() {
    return this.signUpForm.value.email;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {}

  /** Validates the form and creates a new user */
  public async submit() {
    if (this.signUpForm.valid === true) {
      const createUser: CreateUser = {
        username: this.username,
        password: this.password,
        alias: this.alias,
        email: this.email,
      };
      try {
        const res = await this.userService.createUser(createUser);
        this.signUpOutput.emit({
          type: 'sign-up',
          action: 'submit',
          success: true,
          form: createUser,
        });
      } catch (err) {
        if (err.status === 409) {
          // username conflict
          console.log('The username is already taken.'); // display this on screen!
        }
      }
    }
  }

  /** Closes the dialog */
  public dismiss() {
    this.signUpOutput.emit({ type: 'sign-up', action: 'dismiss' });
  }
}
