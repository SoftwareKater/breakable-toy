import { PartialType, OmitType } from '@nestjs/swagger';
import { Todo } from './todo.dto';

export class CreateTodo extends PartialType(OmitType(Todo, ['id'])) {}