import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoComponent } from './todo.component';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TodoFacade } from './todo.facade';

@NgModule({
  declarations: [TodoComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
  ],
  exports: [TodoComponent],
  providers: [TodoFacade],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TodoModule {}
