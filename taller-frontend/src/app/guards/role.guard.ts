import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional de Angular para protección por Roles (Semana 12 - Slide 34 y 35)
 * Replica exactamente las restricciones de Spring Security y Thymeleaf:
 * - adminGuard: sec:authorize="hasRole('ADMIN')"
 * - ordenesGuard: sec:authorize="hasAnyRole('ADMIN', 'MECANICO')"
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.esAdmin()) {
    return true;
  }

  // Redirecciona al Dashboard si no cuenta con rol ADMIN
  router.navigate(['/dashboard']);
  return false;
};

export const ordenesGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.puedeVerOrdenes()) {
    return true;
  }

  // Redirecciona al Dashboard si el rol no es ADMIN ni MECANICO
  router.navigate(['/dashboard']);
  return false;
};
