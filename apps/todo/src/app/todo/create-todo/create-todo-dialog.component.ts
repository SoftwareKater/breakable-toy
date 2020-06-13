import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  Todo,
  CreateTodo,
} from '@breakable-toy/todo/data-access/todo-api-client';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'skbt-create-todo-dialog',
  templateUrl: 'create-todo-dialog.component.html',
})
export class CreateTodoDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateTodoDialogComponent>,
    private readonly fb: FormBuilder
  ) {}

  public ngOnInit() {
    this.form = this.fb.group({
      value: new FormControl(null, Validators.required),
    });
  }

  public dismiss(): void {
    this.dialogRef.close(null);
  }

  public submit(): void {
    if (this.form.valid === true) {
      const newTodo: CreateTodo = {
        value: this.form.value.value,
      };
      this.dialogRef.close(newTodo);
    }
  }
}
