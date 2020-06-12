import {
  TodoService,
  CreateTodo,
} from '@breakable-toy/todo/data-access/todo-api-client';
import { Todo } from '@breakable-toy/todo/data-access/todo-api-client';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const DUMMY_TODOS: Todo[] = [
  {
    id: '1',
    value: 'Work',
    priority: 'high',
    description: 'Cook a very delicious bowl of spaghetti bolognese.',
    status: 'done',
  },
  {
    id: '2',
    value: 'Eat',
    priority: 'medium',
    description: 'Cook a very delicious bowl of spaghetti bolognese.',
    status: 'open',
  },
  {
    id: '3',
    value: 'Sleep',
    priority: 'low',
    description: 'Cook a very delicious bowl of spaghetti bolognese.',
    status: 'done',
  },
];

@Injectable()
export class TodoFacade {

  private _todos = new BehaviorSubject<Todo[]>([]);
  public todos$ = this._todos.asObservable();
  public set todos(value: Todo[]) {
    this._todos.next(value);
  }

  constructor(private readonly todoService: TodoService) {}

  public async init() {
    await this.fetchAndUpdateTodos();
  }

  /** Delete all todos that are marked as done (have status === 'done') */
  public async deleteAllDone(): Promise<void> {
    try {
      const delRes = await this.todoService.todoControllerDeleteByFilter(Todo.StatusEnum.Done).toPromise()
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
      const updatedTodo = await this.updateTodo(tickedOffTodo).toPromise()
      await this.fetchAndUpdateTodos();
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
      const updatedTodo = await this.updateTodo(tickedOffTodo).toPromise()
      await this.fetchAndUpdateTodos();
    } catch (err) {
      console.error(err);
    }
  }

  /** Creates a new todo */
  public async createNewTodo(todo: CreateTodo = null): Promise<void> {
    let created;
    if (todo !== null) {
      created = this.todoService.todoControllerCreate(todo);
    } else {
      const randomIndex = Math.floor(Math.random() * 3);
      const idx = randomIndex === 3 ? 2 : randomIndex;
      created = this.todoService.todoControllerCreate(DUMMY_TODOS[idx]);
    }
    created.subscribe(async (res) => {
      await this.fetchAndUpdateTodos();
    }).catch(err => console.error(err));
  }

  /** Gets all todos and updates the behavior subject */
  private async fetchAndUpdateTodos(): Promise<void> {
    const todos = await this.getAllTodos().toPromise(); 
    this.todos = todos;
  }

  /** Gets all todos */
  private getAllTodos(): Observable<Todo[]> {
    return this.todoService.todoControllerGetAll();
  }

  /** Puts a todo */
  private updateTodo(todo: Todo): Observable<Todo> {
    return this.todoService.todoControllerUpdate(todo.id, todo);
  }
}
