import { Routes } from '@angular/router';

/**
 * Sistema de Enrutamiento Principal de Angular (Semana 12 - Rutas y Componentes Standalone)
 * Carga perezosa (Lazy loading con loadComponent) de todas las pantallas del Taller Mecánico,
 * migrando la totalidad de vistas y funcionalidades de Thymeleaf al frontend Angular.
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

  // MÓDULO CLIENTES
  {
    path: 'clientes',
    loadComponent: () =>
      import('./pages/clientes/clientes-lista.page').then((m) => m.ClientesListaPage),
    title: 'Clientes | Taller Mecánico',
  },
  {
    path: 'clientes/nuevo',
    loadComponent: () =>
      import('./pages/clientes/clientes-form.page').then((m) => m.ClientesFormPage),
    title: 'Nuevo Cliente | Taller Mecánico',
  },
  {
    path: 'clientes/editar/:id',
    loadComponent: () =>
      import('./pages/clientes/clientes-form.page').then((m) => m.ClientesFormPage),
    title: 'Editar Cliente | Taller Mecánico',
  },

  // MÓDULO VEHÍCULOS
  {
    path: 'vehiculos',
    loadComponent: () =>
      import('./pages/vehiculos/vehiculos-lista.page').then((m) => m.VehiculosListaPage),
    title: 'Vehículos | Taller Mecánico',
  },
  {
    path: 'vehiculos/nuevo',
    loadComponent: () =>
      import('./pages/vehiculos/vehiculos-form.page').then((m) => m.VehiculosFormPage),
    title: 'Nuevo Vehículo | Taller Mecánico',
  },
  {
    path: 'vehiculos/editar/:id',
    loadComponent: () =>
      import('./pages/vehiculos/vehiculos-form.page').then((m) => m.VehiculosFormPage),
    title: 'Editar Vehículo | Taller Mecánico',
  },

  // MÓDULO ÓRDENES DE TRABAJO
  {
    path: 'ordenes',
    loadComponent: () =>
      import('./pages/ordenes/ordenes-lista.page').then((m) => m.OrdenesListaPage),
    title: 'Órdenes de Trabajo | Taller Mecánico',
  },
  {
    path: 'ordenes/nuevo',
    loadComponent: () =>
      import('./pages/ordenes/ordenes-form.page').then((m) => m.OrdenesFormPage),
    title: 'Nueva Orden | Taller Mecánico',
  },
  {
    path: 'ordenes/editar/:id',
    loadComponent: () =>
      import('./pages/ordenes/ordenes-form.page').then((m) => m.OrdenesFormPage),
    title: 'Editar Orden | Taller Mecánico',
  },

  // MÓDULOS OPERATIVOS ADICIONALES
  {
    path: 'mecanicos',
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
    loadComponent: () =>
      import('./pages/reportes/reportes.page').then((m) => m.ReportesPage),
    title: 'Reportes | Taller Mecánico',
  },
  {
    path: 'exportar',
    loadComponent: () =>
      import('./pages/exportar/exportar.page').then((m) => m.ExportarPage),
    title: 'Exportar Datos | Taller Mecánico',
  },
  {
    path: 'usuarios',
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

  // RUTA COMODÍN (404)
  {
    path: '**',
    loadComponent: () =>
      import('./pages/no-encontrado/no-encontrado.page').then((m) => m.NoEncontradoPage),
    title: 'Página No Encontrada (404) | Taller Mecánico',
  },
];
