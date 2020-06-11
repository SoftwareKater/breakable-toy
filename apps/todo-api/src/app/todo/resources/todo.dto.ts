import { ApiProperty } from '@nestjs/swagger';
import { TodoStatus } from './todo-status.enum';
import { TodoPriority } from './todo-priority.enum';

export class Todo {
  @ApiProperty({
    example: 'febad8f8-6dc4-4493-a291-5630b6d54ffb',
  })
  id: string;

  @ApiProperty({
    description: 'The todo',
    example: 'Cook Meal',
  })
  value: string;

  @ApiProperty({
    // default: TodoPriority.Medium,
    enum: TodoPriority,
    example: TodoPriority.High,
  })
  priority: TodoPriority;

  @ApiProperty({
    description: 'A longer description of the todo',
    example: 'Cook a very delicious bowl of spaghetti bolognese.',
  })
  description: string;

  @ApiProperty({
    // default: TodoStatus.Open,
    description: 'The status of the todo',
    example: TodoStatus.Done,
    enum: TodoStatus,
  })
  status: TodoStatus;
}
