import { Component, OnInit } from '@angular/core';
import { Todo } from '@breakable-toy/todo/data-access/todo-api-client';
import { TodoFacade } from './todo.facade';

@Component({
  selector: 'skbt-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  displayedColumns: string[] = ['value', /*'priority',*/ 'done'];
  todos: Todo[];

  constructor(private readonly todoFacade: TodoFacade) {}

  public ngOnInit(): void {
    this.todoFacade.init();
    this.todoFacade.todos$.subscribe((t) => {
      this.todos = t;
    });
  }

  public async changeStatus(todo: Todo): Promise<void> {
    const changeTodo = this.todos.find(t => t.id === todo.id);
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

  public addTodo() {
    this.todoFacade.createNewTodo();
  }
}
