import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection,  } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), 
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      SweetAlert2Module.forRoot()
    )
  ]
};