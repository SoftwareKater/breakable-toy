import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { LogInComponent } from './log-in/log-in.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const COMPONENTS = [LogInComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  exports: [...COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService],
})
export class AuthModule {}
