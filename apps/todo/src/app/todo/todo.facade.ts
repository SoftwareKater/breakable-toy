import {
  TodoService,
  CreateTodo,
} from '@breakable-toy/todo/data-access/todo-api-client';
import { Todo } from '@breakable-toy/todo/data-access/todo-api-client';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private _todos$ = this._todos.asObservable();
  public get todos() {
    return this._todos$;
  }

  constructor(private readonly todoService: TodoService) {}

  public async init() {
    await this.updateTodos();
  }

  /** Delete all todos that are marked as done (have status === 'done') */
  public async deleteAllDone(): Promise<void> {
    const delRes = await this.todoService.todoControllerDeleteByFilter('done').toPromise()
    await this.updateTodos();
  }

  /** Returns all todos */
  public getAllTodos() {
    return this.todoService.todoControllerGetAll();
  }

  /** Updates the status of a given todo to 'done' */
  public tickOffTodo(todo: Todo): void {
    const tickedOffTodo: Todo = {
      ...todo,
      status: 'done',
    };
    this.todoService.todoControllerUpdate(todo.id, tickedOffTodo).subscribe(async (res) => {
      await this.updateTodos();
    });
  }

  public untickTodo(todo: Todo): void {
    
  }

  /** Creates a new todo */
  public async createNewTodo(todo: CreateTodo = null) {
    let created;
    if (todo !== null) {
      created = this.todoService.todoControllerCreate(todo);
    } else {
      const randomIndex = Math.floor(Math.random() * 3);
      const idx = randomIndex === 3 ? 2 : randomIndex;
      created = this.todoService.todoControllerCreate(DUMMY_TODOS[idx]);
    }
    created.subscribe(async (res) => {
      await this.updateTodos();
    });
  }

  private async updateTodos() {
    const todos = await this.getAllTodos().toPromise(); 
    this._todos.next(todos);
  }
}
