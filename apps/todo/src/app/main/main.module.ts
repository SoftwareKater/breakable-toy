import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatIconModule } from '@angular/material/icon';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { AuthModule } from '../auth/auth.module';
import { TodoModule } from '../todo/todo.module';
import { TodoComponent } from '../todo/todo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MainFacade } from './main.facade';

const ROUTES: Routes = [
  { path: 'todo', component: TodoComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

const CUSTOM_MODULES = [AuthModule, TodoModule];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule.forRoot(ROUTES),
    ...CUSTOM_MODULES,
  ],
  exports: [MainComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MainFacade],
})
export class MainModule {}
