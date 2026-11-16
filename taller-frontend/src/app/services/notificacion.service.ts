import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error' | 'advertencia';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private siguienteId = 0;
  private readonly _lista = signal<Notificacion[]>([]);
  readonly lista = this._lista.asReadonly();

  exito(mensaje: string, titulo = 'Listo'): void {
    this.agregar('exito', titulo, mensaje);
  }

  error(mensaje: string, titulo = 'Error'): void {
    this.agregar('error', titulo, mensaje);
  }

  advertencia(mensaje: string, titulo = 'Atención'): void {
    this.agregar('advertencia', titulo, mensaje);
  }

  cerrar(id: number): void {
    this._lista.update((l) => l.filter((n) => n.id !== id));
  }

  private agregar(tipo: TipoNotificacion, titulo: string, mensaje: string): void {
    const id = ++this.siguienteId;
    this._lista.update((l) => [...l, { id, tipo, titulo, mensaje }]);
    setTimeout(() => this.cerrar(id), 6000);
  }
}