import { Routes } from '@angular/router';
import { adminGuard, ordenesGuard } from './guards/role.guard';

/**
 * Sistema de Enrutamiento Principal de Angular (Semana 12 - Rutas, Guards y Carga Perezosa)
 * Replica con exactitud las reglas de seguridad de Spring Security y Thymeleaf:
 * - adminGuard: Protege rutas exclusivas para ADMIN (Clientes, Vehículos, Mecánicos, Reportes, Exportar, Usuarios)
 * - ordenesGuard: Protege rutas para ADMIN y MECANICO (Órdenes de trabajo)
 * - Rutas abiertas a todos los roles autenticados: Dashboard, Historial
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    title: 'Dashboard | Taller Mecánico',
  },

  // MÓDULO CLIENTES (Exclusivo ADMIN)
  {
    path: 'clientes',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/clientes/clientes-lista.page').then((m) => m.ClientesListaPage),
    title: 'Clientes | Taller Mecánico',
  },
  {
    path: 'clientes/nuevo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/clientes/clientes-form.page').then((m) => m.ClientesFormPage),
    title: 'Nuevo Cliente | Taller Mecánico',
  },
  {
    path: 'clientes/editar/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/clientes/clientes-form.page').then((m) => m.ClientesFormPage),
    title: 'Editar Cliente | Taller Mecánico',
  },

  // MÓDULO VEHÍCULOS (Exclusivo ADMIN)
  {
    path: 'vehiculos',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/vehiculos/vehiculos-lista.page').then((m) => m.VehiculosListaPage),
    title: 'Vehículos | Taller Mecánico',
  },
  {
    path: 'vehiculos/nuevo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/vehiculos/vehiculos-form.page').then((m) => m.VehiculosFormPage),
    title: 'Nuevo Vehículo | Taller Mecánico',
  },
  {
    path: 'vehiculos/editar/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/vehiculos/vehiculos-form.page').then((m) => m.VehiculosFormPage),
    title: 'Editar Vehículo | Taller Mecánico',
  },

  // MÓDULO ÓRDENES DE TRABAJO (ADMIN y MECÁNICO)
  {
    path: 'ordenes',
    canActivate: [ordenesGuard],
    loadComponent: () =>
      import('./pages/ordenes/ordenes-lista.page').then((m) => m.OrdenesListaPage),
    title: 'Órdenes de Trabajo | Taller Mecánico',
  },
  {
    path: 'ordenes/nuevo',
    canActivate: [ordenesGuard],
    loadComponent: () =>
      import('./pages/ordenes/ordenes-form.page').then((m) => m.OrdenesFormPage),
    title: 'Nueva Orden | Taller Mecánico',
  },
  {
    path: 'ordenes/editar/:id',
    canActivate: [ordenesGuard],
    loadComponent: () =>
      import('./pages/ordenes/ordenes-form.page').then((m) => m.OrdenesFormPage),
    title: 'Editar Orden | Taller Mecánico',
  },

  // MÓDULOS OPERATIVOS
  {
    path: 'mecanicos',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/mecanicos/mecanicos.page').then((m) => m.MecanicosPage),
    title: 'Mecánicos | Taller Mecánico',
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./pages/historial/historial.page').then((m) => m.HistorialPage),
    title: 'Historial | Taller Mecánico',
  },
  {
    path: 'reportes',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/reportes/reportes.page').then((m) => m.ReportesPage),
    title: 'Reportes | Taller Mecánico',
  },
  {
    path: 'exportar',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/exportar/exportar.page').then((m) => m.ExportarPage),
    title: 'Exportar Datos | Taller Mecánico',
  },
  {
    path: 'usuarios',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/usuarios/usuarios.page').then((m) => m.UsuariosPage),
    title: 'Usuarios y Seguridad | Taller Mecánico',
  },

  // AUTENTICACIÓN
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    title: 'Iniciar Sesión | Taller Mecánico',
  },

  // 404 WILDCARD
  {
    path: '**',
    loadComponent: () =>
      import('./pages/no-encontrado/no-encontrado.page').then((m) => m.NoEncontradoPage),
    title: 'Página No Encontrada (404) | Taller Mecánico',
  },
];
