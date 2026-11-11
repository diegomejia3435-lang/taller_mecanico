import { Injectable, computed, signal } from '@angular/core';

export interface UsuarioSesion {
  username: string;
  nombreCompleto: string;
  rol: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Estado reactivo de sesión con Signals (Semana 12 - Slide 25)
  private readonly _usuarioActual = signal<UsuarioSesion>({
    username: 'admin',
    nombreCompleto: 'Administrador',
    rol: 'ADMIN',
  });

  readonly usuario = this._usuarioActual.asReadonly();
  readonly estaAutenticado = computed(
    () => !!this.usuario().username && this.usuario().rol !== 'INVITADO'
  );

  // Normalización de roles (ADMIN, MECANICO, CLIENTE)
  readonly esAdmin = computed(
    () => this.usuario().rol === 'ADMIN' || this.usuario().rol === 'ROLE_ADMIN'
  );
  readonly esMecanico = computed(
    () => this.usuario().rol === 'MECANICO' || this.usuario().rol === 'ROLE_MECANICO'
  );
  readonly esCliente = computed(
    () => this.usuario().rol === 'CLIENTE' || this.usuario().rol === 'ROLE_CLIENTE'
  );

  /**
   * Permisos idénticos a los definidos en Spring Security y Thymeleaf layouts/main.html:
   * - Clientes: hasRole('ADMIN')
   * - Vehículos: hasRole('ADMIN')
   * - Órdenes: hasAnyRole('ADMIN', 'MECANICO')
   * - Mecánicos: hasRole('ADMIN')
   * - Historial: hasAnyRole('ADMIN', 'MECANICO', 'CLIENTE')
   * - Reportes: hasRole('ADMIN')
   * - Exportar: hasRole('ADMIN')
   * - Usuarios: hasRole('ADMIN')
   */
  readonly puedeVerClientes = computed(() => this.esAdmin());
  readonly puedeVerVehiculos = computed(() => this.esAdmin());
  readonly puedeVerMecanicos = computed(() => this.esAdmin());
  readonly puedeVerReportes = computed(() => this.esAdmin());
  readonly puedeVerExportar = computed(() => this.esAdmin());
  readonly puedeVerUsuarios = computed(() => this.esAdmin());
  readonly puedeVerOrdenes = computed(() => this.esAdmin() || this.esMecanico());
  readonly puedeVerHistorial = computed(
    () => this.esAdmin() || this.esMecanico() || this.esCliente()
  );

  login(username: string, nombreCompleto: string, rol: string, token?: string): void {
    this._usuarioActual.set({
      username,
      nombreCompleto,
      rol,
      token,
    });
  }

  logout(): void {
    this._usuarioActual.set({
      username: '',
      nombreCompleto: 'Invitado',
      rol: 'INVITADO',
    });
  }
}
