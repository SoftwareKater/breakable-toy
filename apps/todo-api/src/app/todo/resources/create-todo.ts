import { ApiProperty } from '@nestjs/swagger';
import { TodoStatus } from './todo-status.enum';
import { TodoPriority } from './todo-priority.enum';

export class CreateTodo {
  @ApiProperty({
    description: 'The todo',
    example: 'Cook Meal',
    required: true,
  })
  value: string;

  @ApiProperty({
    default: TodoPriority.Medium,
    enum: TodoPriority,
    example: TodoPriority.High,
    required: false,
  })
  priority?: TodoPriority;

  @ApiProperty({
    description: 'A longer description of the todo',
    example: 'Cook a very delicious bowl of spaghetti bolognese.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    default: TodoStatus.Open,
    description: 'The status of the todo',
    example: TodoStatus.Done,
    enum: TodoStatus,
    required: false,
  })
  status?: TodoStatus;
}
