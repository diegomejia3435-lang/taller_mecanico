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
  readonly estaAutenticado = computed(() => !!this.usuario().username);
  readonly esAdmin = computed(() => this.usuario().rol === 'ADMIN');
  readonly esMecanico = computed(() => this.usuario().rol === 'MECANICO');

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
