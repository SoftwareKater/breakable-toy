import { PartialType, OmitType } from '@nestjs/swagger';
import { Todo } from './todo.dto';

export class UpdateTodo extends PartialType(OmitType(Todo, ['id'])) {}