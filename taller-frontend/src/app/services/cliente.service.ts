import { Injectable, signal } from '@angular/core';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  // Lista inicial de clientes sincronizada con el backend (DataInitializer)
  private readonly _clientes = signal<Cliente[]>([
    {
      id: 1,
      nombreCompleto: 'Juan Pérez',
      dni: '77777777',
      telefono: '955555555',
      correo: 'juan@gmail.com',
    },
    {
      id: 2,
      nombreCompleto: 'María Gómez López',
      dni: '45678912',
      telefono: '987654321',
      correo: 'maria.gomez@gmail.com',
    },
    {
      id: 3,
      nombreCompleto: 'Roberto Quispe Flores',
      dni: '71234567',
      telefono: '944332211',
      correo: 'rquispe@outlook.com',
    },
    {
      id: 4,
      nombreCompleto: 'Lucía Mendoza Rojas',
      dni: '82345678',
      telefono: '912345678',
      correo: 'lucia.mendoza@yahoo.com',
    },
  ]);

  readonly clientes = this._clientes.asReadonly();

  listar(): Cliente[] {
    return this.clientes();
  }

  buscarPorId(id: number): Cliente | undefined {
    return this.clientes().find((c) => c.id === id);
  }

  buscar(termino: string): Cliente[] {
    if (!termino || !termino.trim()) return this.clientes();
    const t = termino.toLowerCase().trim();
    return this.clientes().filter(
      (c) =>
        c.nombreCompleto.toLowerCase().includes(t) ||
        c.dni.includes(t) ||
        (c.correo && c.correo.toLowerCase().includes(t)) ||
        (c.telefono && c.telefono.includes(t))
    );
  }

  guardar(cliente: Cliente): Cliente {
    if (cliente.id) {
      // Edición
      this._clientes.update((lista) =>
        lista.map((c) => (c.id === cliente.id ? { ...cliente } : c))
      );
      return cliente;
    } else {
      // Nuevo
      const nuevoId =
        this.clientes().reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
      const nuevoCliente: Cliente = { ...cliente, id: nuevoId };
      this._clientes.update((lista) => [...lista, nuevoCliente]);
      return nuevoCliente;
    }
  }

  eliminar(id: number): boolean {
    const existe = this.buscarPorId(id);
    if (!existe) return false;
    this._clientes.update((lista) => lista.filter((c) => c.id !== id));
    return true;
  }
}
