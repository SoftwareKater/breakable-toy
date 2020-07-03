import {
  TodoService,
  CreateTodo,
} from '@breakable-toy/todo/data-access/todo-api-client';
import { Todo } from '@breakable-toy/todo/data-access/todo-api-client';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionService } from '../shared/services/session.service';

/**
 * Facade between the TodoComponent and the TodoAPI Backend. The database serves as the
 * single source of truth, i.e. there is no STATE here. After creation and deletion of
 * a todo the facade will automatically refetch all todos.
 */
@Injectable()
export class TodoFacade {
  private _todos = new BehaviorSubject<Todo[]>([]);
  public todos$ = this._todos.asObservable();
  private set todos(value: Todo[]) {
    this._todos.next(value);
  }

  constructor(
    private readonly todoService: TodoService,
    private readonly sessionService: SessionService
  ) {}

  public async init() {
    await this.fetchAndUpdateTodos();
  }

  /** Delete all todos that are marked as done (have status === 'done') */
  public async deleteAllDone(): Promise<void> {
    try {
      const delRes = await this.todoService
        .deleteByFilter(Todo.StatusEnum.Done)
        .toPromise();
      await this.fetchAndUpdateTodos();
    } catch (err) {
      console.error(err);
    }
  }

  /** Updates the status of a given todo to 'done' */
  public async tickOffTodo(todo: Todo): Promise<void> {
    const tickedOffTodo: Todo = {
      ...todo,
      status: Todo.StatusEnum.Done,
    };
    try {
      const updatedTodo = await this.updateTodo(tickedOffTodo).toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  public async untickTodo(todo: Todo): Promise<void> {
    const tickedOffTodo: Todo = {
      ...todo,
      status: Todo.StatusEnum.Open,
    };
    try {
      const updatedTodo = await this.updateTodo(tickedOffTodo).toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  /** Creates a new todo */
  public async createNewTodo(todo: CreateTodo = null): Promise<void> {
    if (todo?.userId === null) {
      const user = await this.sessionService.user$.toPromise()
      todo.userId = user.id;
    }
    const created = this.todoService.create(todo);    
    try {
      const res = await created.toPromise();
      await this.fetchAndUpdateTodos();
    } catch (err) {
      console.error(err);
    }
  }

  /** Gets all todos and updates the behavior subject */
  private async fetchAndUpdateTodos(): Promise<void> {
    const todos = await this.getAllTodos().toPromise();
    this.todos = todos;
  }

  /** Gets all todos */
  private getAllTodos(): Observable<Todo[]> {
    return this.todoService.getAll();
  }

  /** Puts a todo */
  private updateTodo(todo: Todo): Observable<Todo> {
    return this.todoService.update(todo.id, todo);
  }
}
