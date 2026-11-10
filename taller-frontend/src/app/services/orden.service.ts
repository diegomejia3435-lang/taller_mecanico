import { Injectable, signal } from '@angular/core';
import { EstadoOrden, OrdenMantenimiento } from '../models/orden.model';

@Injectable({
  providedIn: 'root',
})
export class OrdenService {
  private readonly _ordenes = signal<OrdenMantenimiento[]>([
    {
      id: 1,
      vehiculo: {
        id: 1,
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Corolla Sedan',
        cliente: {
          id: 1,
          nombreCompleto: 'Juan Pérez',
          dni: '77777777',
        },
      },
      mecanico: {
        id: 2,
        username: 'carlos',
        nombreCompleto: 'Carlos Mendoza',
        especialidad: 'Motor y Frenos',
      },
      fechaIngreso: '2026-05-10 09:30',
      estado: 'EN_PROCESO',
      diagnosticoTecnico: 'Cambio de pastillas y afinamiento electrónico de motor.',
      montoTotal: 360.0,
    },
    {
      id: 2,
      vehiculo: {
        id: 2,
        placa: 'XYZ-789',
        marca: 'Nissan',
        modelo: 'Sentra Advance',
        cliente: {
          id: 2,
          nombreCompleto: 'María Gómez López',
          dni: '45678912',
        },
      },
      mecanico: {
        id: 2,
        username: 'carlos',
        nombreCompleto: 'Carlos Mendoza',
        especialidad: 'Motor',
      },
      fechaIngreso: '2026-05-11 11:00',
      estado: 'PENDIENTE',
      diagnosticoTecnico: 'Revisión por ruido en suspensión delantera y calibración.',
      montoTotal: 150.0,
    },
    {
      id: 3,
      vehiculo: {
        id: 3,
        placa: 'M1N-456',
        marca: 'Hyundai',
        modelo: 'Tucson SUV',
        cliente: {
          id: 3,
          nombreCompleto: 'Roberto Quispe Flores',
          dni: '71234567',
        },
      },
      mecanico: {
        id: 2,
        username: 'carlos',
        nombreCompleto: 'Carlos Mendoza',
        especialidad: 'Mantenimiento Preventivo',
      },
      fechaIngreso: '2026-05-08 08:15',
      fechaSalida: '2026-05-09 17:00',
      estado: 'TERMINADO',
      diagnosticoTecnico: 'Mantenimiento preventivo general completado con éxito.',
      montoTotal: 250.0,
    },
  ]);

  readonly ordenes = this._ordenes.asReadonly();

  listar(): OrdenMantenimiento[] {
    return this.ordenes();
  }

  buscarPorId(id: number): OrdenMantenimiento | undefined {
    return this.ordenes().find((o) => o.id === id);
  }

  filtrar(termino?: string, estado?: string): OrdenMantenimiento[] {
    let resultado = this.ordenes();

    if (estado && estado.trim() !== '' && estado !== 'TODOS') {
      resultado = resultado.filter((o) => o.estado === estado);
    }

    if (termino && termino.trim() !== '') {
      const t = termino.toLowerCase().trim();
      resultado = resultado.filter(
        (o) =>
          o.vehiculo.placa.toLowerCase().includes(t) ||
          o.vehiculo.marca.toLowerCase().includes(t) ||
          (o.vehiculo.cliente &&
            o.vehiculo.cliente.nombreCompleto.toLowerCase().includes(t)) ||
          (o.diagnosticoTecnico &&
            o.diagnosticoTecnico.toLowerCase().includes(t)) ||
          o.id?.toString().includes(t)
      );
    }

    return resultado;
  }

  guardar(orden: OrdenMantenimiento): OrdenMantenimiento {
    if (orden.id) {
      this._ordenes.update((lista) =>
        lista.map((o) => (o.id === orden.id ? { ...orden } : o))
      );
      return orden;
    } else {
      const nuevoId =
        this.ordenes().reduce((max, o) => Math.max(max, o.id || 0), 0) + 1;
      const nuevaOrden: OrdenMantenimiento = {
        ...orden,
        id: nuevoId,
        fechaIngreso:
          orden.fechaIngreso ||
          new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      this._ordenes.update((lista) => [...lista, nuevaOrden]);
      return nuevaOrden;
    }
  }

  cambiarEstado(id: number, nuevoEstado: EstadoOrden): void {
    this._ordenes.update((lista) =>
      lista.map((o) => {
        if (o.id === id) {
          const salida =
            nuevoEstado === 'TERMINADO'
              ? new Date().toISOString().replace('T', ' ').substring(0, 16)
              : o.fechaSalida;
          return { ...o, estado: nuevoEstado, fechaSalida: salida };
        }
        return o;
      })
    );
  }

  eliminar(id: number): boolean {
    const existe = this.buscarPorId(id);
    if (!existe) return false;
    this._ordenes.update((lista) => lista.filter((o) => o.id !== id));
    return true;
  }
}
