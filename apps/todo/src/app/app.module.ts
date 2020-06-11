import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { TodoModule } from './todo/todo.module';
import { ConfigurationParameters, ApiModule, Configuration } from '@breakable-toy/todo/data-access/todo-api-client';
import { HttpClientModule } from '@angular/common/http';
// import { AppRoutingModule } from './app-routing.module';

const apiConfigFactory = (): Configuration => {
  const params: ConfigurationParameters = {
    // set configuration parameters here.
    basePath: `//${location.host}`// environment.apiBasePath + ':' + environment.apiPort,
  }
  return new Configuration(params);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    // AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    TodoModule,
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
