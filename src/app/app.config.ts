import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { httpInterceptor } from './services/http-interceptor';
import { HttpCacheService } from './services/http-cache.service';
import { HttpClientModule } from '@angular/common/http';
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true },
];
export const appConfig: ApplicationConfig = {
  
  // providers: [
  //   provideRouter(routes),
  //   provideHttpClient(),
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: HttpCacheService,
  //     multi: true
  //   }
  // ]
  providers: [
    provideRouter(routes),
    // provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    httpInterceptorProviders,
    // provideHttpClient(withInterceptors([httpInterceptor])),
  ],
};
