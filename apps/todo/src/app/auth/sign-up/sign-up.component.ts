import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'skbt-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup = this.fb.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(12)]),
    alias: new FormControl(),
    email: new FormControl('', [Validators.email]),
  });
  hide = true;
  get passwordInput() {
    return this.signUpForm.get('password');
  }

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {}

  public submit() {}

  public dismiss() {}
}
