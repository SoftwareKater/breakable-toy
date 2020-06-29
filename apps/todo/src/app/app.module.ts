import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import {
  ConfigurationParameters,
  ApiModule as TodoApiModule,
  Configuration,
} from '@breakable-toy/todo/data-access/todo-api-client';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainModule } from './main/main.module';
import { ApiModule as AuthApiModule } from '@breakable-toy/shared/data-access/auth-api-client';
import { SharedModule } from './shared/shared.module';
import { SessionService } from './shared/services/session.service';

const apiConfigFactory = (): Configuration => {
  const params: ConfigurationParameters = {
    // set configuration parameters here.
    basePath: `//${location.host}`, // environment.apiBasePath + ':' + environment.apiPort,
  };
  return new Configuration(params);
};

const authApiConfigFactory = (): Configuration => {
  const params: ConfigurationParameters = {
    basePath: `//${location.host}`,   // actual base path is different, handled by proxy.conf.json
  };
  return new Configuration(params);
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    TodoApiModule.forRoot(apiConfigFactory),
    AuthApiModule.forRoot(authApiConfigFactory),
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MainModule,
    SharedModule,
  ],
  providers: [
    // {
    //   provide: Configuration,
    //   useFactory: (authService: AuthService) => new Configuration(
    //     {
    //       basePath: environment.apiUrl,
    //       accessToken: authService.getAccessToken.bind(authService)
    //     }
    //   ),
    //   deps: [AuthService],
    //   multi: false
    // }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
