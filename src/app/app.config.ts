import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode, provideHttpClient,withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

export class ConfigFactory implements HttpInterceptor{

  constructor(private authService:AuthService){}


  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(
      catchError(event => {
        switch (event.status) {
          case HttpStatusCode.Unauthorized:
            this.authService.finalizeLogout();
            break;
          case HttpStatusCode.InternalServerError:
            break;
        }
        return throwError(event);
      })
    );
  }

}

export const appConfig: ApplicationConfig = {
  providers: [
    CookieService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:ConfigFactory,
      multi:true,
      deps:[AuthService]
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi())
  ]
};
