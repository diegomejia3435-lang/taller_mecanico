import { Routes } from '@angular/router';

/**
 * Configuración de Rutas Principales del Sistema (Angular Router)
 * Estructurado conforme al tema de Rutas y Componentes Standalone (Semana 12).
 * Implementa:
 * - Redirección por defecto a '/inicio' con pathMatch: 'full'
 * - Carga perezosa (Lazy loading) mediante loadComponent()
 * - Parámetro dinámico ':id' en '/servicios/:id'
 * - Ruta comodín (Wildcard) '**' para gestión de página no encontrada (404)
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio.page').then(m => m.InicioPage),
    title: 'Inicio | Taller Mecánico Especializado'
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./pages/servicios/servicios.page').then(m => m.ServiciosPage),
    title: 'Catálogo de Servicios | Taller Mecánico'
  },
  {
    path: 'servicios/:id',
    loadComponent: () =>
      import('./pages/servicio-detalle/servicio-detalle.page').then(m => m.ServicioDetallePage),
    title: 'Detalle de Servicio | Taller Mecánico'
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./pages/favoritos/favoritos.page').then(m => m.FavoritosPage),
    title: 'Servicios Guardados | Taller Mecánico'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/no-encontrado/no-encontrado.page').then(m => m.NoEncontradoPage),
    title: '404 - Página no encontrada | Taller Mecánico'
  }
];
