import { Component, OnInit } from '@angular/core';
import { Todo, CreateTodo } from '@breakable-toy/todo/data-access/todo-api-client';
import { TodoFacade } from './todo.facade';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CreateTodoDialogComponent } from './create-todo/create-todo-dialog.component';

@Component({
  selector: 'skbt-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  displayedColumns: string[] = ['value', 'priority', 'done'];
  todos: Todo[];

  constructor(
    private readonly todoFacade: TodoFacade,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.todoFacade.init();
    this.todoFacade.todos$.subscribe((t) => {
      this.todos = t;
    });
  }

  public async changeStatus(todo: Todo): Promise<void> {
    const changeTodo = this.todos.find((t) => t.id === todo.id);
    if (changeTodo.status === Todo.StatusEnum.Done) {
      changeTodo.status = Todo.StatusEnum.Open;
      await this.todoFacade.untickTodo(todo);
    } else {
      changeTodo.status = Todo.StatusEnum.Done;
      await this.todoFacade.tickOffTodo(todo);
    }
  }

  public async deleteAllDone(): Promise<void> {
    await this.todoFacade.deleteAllDone();
  }

  public addTodo(todo: CreateTodo): void {
    this.todoFacade.createNewTodo(todo);
  }

  public getProgress(): number {
    return  100 * this.todos.filter(t => t.status === 'done').length / this.todos.length;
  }

  public openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';

    const createTodoDialogRef = this.dialog.open(
      CreateTodoDialogComponent,
      dialogConfig
    );

    createTodoDialogRef.afterClosed().subscribe((result: CreateTodo) => {
      if (result === null) {
        return;
      } else {
        this.addTodo(result);
      }
    });
  }
}
