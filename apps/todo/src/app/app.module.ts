// Angular
import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { SharedModule } from './shared/shared.module';
import { SessionService } from './shared/services/session.service';

// Api & Microservices
import {
  ApiModule as TodoApiModule,
  Configuration as TodoApiConfig,
  ConfigurationParameters as TodoApiConfigParams,
} from '@breakable-toy/todo/data-access/todo-api-client';
import {
  ApiModule as AuthApiModule,
  Configuration as AuthApiConfig,
  ConfigurationParameters as AuthApiConfigParams,
} from '@breakable-toy/shared/data-access/auth-api-client';
import {
  ApiModule as UserApiModule,
  Configuration as UserApiConfig,
  ConfigurationParameters as UserApiConfigParams,
} from '@breakable-toy/shared/data-access/user-api-client';

const todoApiConfigFactory = (): TodoApiConfig => {
  const params: TodoApiConfigParams = {
    // set configuration parameters here.
    basePath: `//${location.host}`, // environment.apiBasePath + ':' + environment.apiPort,
  };
  return new TodoApiConfig(params);
};

const authApiConfigFactory = (): AuthApiConfig => {
  const params: AuthApiConfigParams = {
    basePath: `//${location.host}`, // actual base path is different, handled by proxy.conf.json
  };
  return new AuthApiConfig(params);
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    TodoApiModule.forRoot(todoApiConfigFactory),
    AuthApiModule.forRoot(authApiConfigFactory),
    UserApiModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MainModule,
    SharedModule,
  ],
  providers: [
    {
      provide: UserApiConfig,
      useFactory: () => {
        return new UserApiConfig({
          basePath: `//${location.host}`, // actual base path is different, handled by proxy.conf.json
          accessToken: () => sessionStorage.getItem('access_token'),
        });
      },
      deps: [SessionService],
      multi: false,
    },
    {
      provide: TodoApiConfig,
      useFactory: () => {
        return new UserApiConfig({
          basePath: `//${location.host}`, // actual base path is different, handled by proxy.conf.json
          accessToken: () => sessionStorage.getItem('access_token'),
        });
      },
      deps: [SessionService],
      multi: false,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
