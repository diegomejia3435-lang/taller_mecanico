import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificacionService } from '../services/notificacion.service';
import { describirError } from '../utils/http-error';

/**
 * Manejo global de errores:
 *  - 401 (fuera del login): cierra la sesión y manda al login.
 *  - 403, sin conexión y 5xx: muestra una notificación.
 * Los 400, 404 y 409 los muestra cada pantalla donde ocurren.
 */
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notificaciones = inject(NotificacionService);

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      const info = describirError(err);
      const esLogin = request.url.endsWith('/api/auth/login');

      if (err.status === 401 && !esLogin) {
        auth.logout();
        notificaciones.advertencia('Tu sesión expiró o no es válida. Inicia sesión nuevamente.', info.titulo);
        router.navigate(['/login']);
      } else if ((err.status === 403 || err.status === 0 || err.status >= 500) && !esLogin) {
        notificaciones.error(info.mensaje, info.titulo);
      }

      return throwError(() => err);
    })
  );
};