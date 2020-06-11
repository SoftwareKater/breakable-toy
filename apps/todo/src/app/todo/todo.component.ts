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
    this.todoFacade.todos.subscribe((t) => {
      this.todos = t;
    });
  }

  public changeStatus(todo: Todo): void {
    const changeTodo = this.todos.find(t => t.id === todo.id);
    if (changeTodo.status === 'done') {
      changeTodo.status = 'open';
      this.todoFacade.untickTodo(todo)
    } else {
      changeTodo.status = 'done'
      this.todoFacade.tickOffTodo(todo)
    }
  }

  public async deleteAllDone(): Promise<void> {
    await this.todoFacade.deleteAllDone();
  }

  public setDone(todo: Todo) {}

  public addTodo() {
    this.todoFacade.createNewTodo();
  }
}
