import { Injectable, signal } from '@angular/core';
import { Vehiculo } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private readonly _vehiculos = signal<Vehiculo[]>([
    {
      id: 1,
      placa: 'ABC-123',
      marca: 'Toyota',
      modelo: 'Corolla Sedan',
      anio: 2021,
      tipoMotor: '1.8L Gasolina',
      cliente: {
        id: 1,
        nombreCompleto: 'Juan Pérez',
        dni: '77777777',
      },
    },
    {
      id: 2,
      placa: 'XYZ-789',
      marca: 'Nissan',
      modelo: 'Sentra Advance',
      anio: 2020,
      tipoMotor: '2.0L Gasolina',
      cliente: {
        id: 2,
        nombreCompleto: 'María Gómez López',
        dni: '45678912',
      },
    },
    {
      id: 3,
      placa: 'M1N-456',
      marca: 'Hyundai',
      modelo: 'Tucson SUV',
      anio: 2022,
      tipoMotor: '2.4L Gasolina / GLP',
      cliente: {
        id: 3,
        nombreCompleto: 'Roberto Quispe Flores',
        dni: '71234567',
      },
    },
    {
      id: 4,
      placa: 'B8K-312',
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2023,
      tipoMotor: '2.0L Diésel',
      cliente: {
        id: 4,
        nombreCompleto: 'Lucía Mendoza Rojas',
        dni: '82345678',
      },
    },
  ]);

  readonly vehiculos = this._vehiculos.asReadonly();

  listar(): Vehiculo[] {
    return this.vehiculos();
  }

  buscarPorId(id: number): Vehiculo | undefined {
    return this.vehiculos().find((v) => v.id === id);
  }

  buscar(termino: string): Vehiculo[] {
    if (!termino || !termino.trim()) return this.vehiculos();
    const t = termino.toLowerCase().trim();
    return this.vehiculos().filter(
      (v) =>
        v.placa.toLowerCase().includes(t) ||
        v.marca.toLowerCase().includes(t) ||
        (v.modelo && v.modelo.toLowerCase().includes(t)) ||
        (v.cliente && v.cliente.nombreCompleto.toLowerCase().includes(t))
    );
  }

  guardar(vehiculo: Vehiculo): Vehiculo {
    if (vehiculo.id) {
      this._vehiculos.update((lista) =>
        lista.map((v) => (v.id === vehiculo.id ? { ...vehiculo } : v))
      );
      return vehiculo;
    } else {
      const nuevoId =
        this.vehiculos().reduce((max, v) => Math.max(max, v.id || 0), 0) + 1;
      const nuevoVehiculo: Vehiculo = { ...vehiculo, id: nuevoId };
      this._vehiculos.update((lista) => [...lista, nuevoVehiculo]);
      return nuevoVehiculo;
    }
  }

  eliminar(id: number): boolean {
    const existe = this.buscarPorId(id);
    if (!existe) return false;
    this._vehiculos.update((lista) => lista.filter((v) => v.id !== id));
    return true;
  }
}
