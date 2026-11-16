import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioSesion {
  username: string;
  nombreCompleto: string;
  rol: string;
  token?: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  tipo?: string;
  tokenType?: string;
  username: string;
  rol: string;
  expiraEnSegundos?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'taller_access_token';
  private readonly userKey = 'taller_auth_user';

  private readonly _tokenState = signal<string | null>(
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(this.tokenKey) : null
  );

  private readonly _usuarioActual = signal<UsuarioSesion>(this.readInitialUser());

  readonly token = this._tokenState.asReadonly();
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

  private readInitialUser(): UsuarioSesion {
    if (typeof sessionStorage !== 'undefined') {
      const guardado = sessionStorage.getItem(this.userKey);
      if (guardado) {
        try {
          return JSON.parse(guardado) as UsuarioSesion;
        } catch {
          sessionStorage.removeItem(this.userKey);
        }
      }
    }
    // Usuario por defecto administrativo inicial
    return {
      username: 'admin',
      nombreCompleto: 'Administrador General',
      rol: 'ROLE_ADMIN',
    };
  }

  loginApi(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, credentials)
      .pipe(
        tap((res) => {
          const jwtToken = res.accessToken || res.token || '';
          const rolLimpio = res.rol || 'ROLE_USER';
          const usuario: UsuarioSesion = {
            username: res.username,
            nombreCompleto: res.username === 'carlos' ? 'Carlos Mendoza' : (res.username === 'admin' ? 'Administrador General' : res.username),
            rol: rolLimpio,
            token: jwtToken,
          };

          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(this.tokenKey, jwtToken);
            sessionStorage.setItem(this.userKey, JSON.stringify(usuario));
          }

          this._tokenState.set(jwtToken);
          this._usuarioActual.set(usuario);
        })
      );
  }

  login(username: string, nombreCompleto: string, rol: string, token?: string): void {
    const usuario: UsuarioSesion = {
      username,
      nombreCompleto,
      rol,
      token,
    };
    if (typeof sessionStorage !== 'undefined') {
      if (token) sessionStorage.setItem(this.tokenKey, token);
      sessionStorage.setItem(this.userKey, JSON.stringify(usuario));
    }
    if (token) this._tokenState.set(token);
    this._usuarioActual.set(usuario);
  }

  logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.userKey);
    }
    this._tokenState.set(null);
    this._usuarioActual.set({
      username: '',
      nombreCompleto: 'Invitado',
      rol: 'INVITADO',
    });
  }
}
