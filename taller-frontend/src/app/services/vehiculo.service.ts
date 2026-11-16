import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Vehiculo } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/vehiculos`;

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
  readonly cargando = signal<boolean>(false);
  readonly error = signal<string>('');

  constructor() {
    this.cargar();
  }

  /**
   * Carga reactiva de vehículos consultando la API REST de Spring Boot (GET /api/vehiculos)
   */
  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.http.get<Vehiculo[]>(this.url).subscribe({
      next: (datos) => {
        if (datos && datos.length > 0) {
          this._vehiculos.set(datos);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con la API REST de Vehículos en Spring Boot.');
        this.cargando.set(false);
      },
    });
  }

  /**
   * Consumo HTTP GET /api/vehiculos
   */
  listar(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.url).pipe(
      tap((datos) => this._vehiculos.set(datos))
    );
  }

  /**
   * Consumo HTTP GET /api/vehiculos/{id}
   */
  buscarPorId(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.url}/${id}`);
  }

  /**
   * Búsqueda síncrona en caché reactiva para Signals y formularios
   */
  buscarPorIdLocal(id: number): Vehiculo | undefined {
    return this.vehiculos().find((v) => v.id === id);
  }

  /**
   * Consumo HTTP GET /api/vehiculos/rango-anio?min={min}&max={max} (JPQL BETWEEN)
   */
  buscarPorRangoAnio(min: number, max: number): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.url}/rango-anio?min=${min}&max=${max}`);
  }

  /**
   * Filtro reactivo local para búsqueda interactiva en tiempo real
   */
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

  /**
   * Consumo HTTP POST /api/vehiculos (Registro)
   */
  crear(vehiculo: Partial<Vehiculo>): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.url, vehiculo).pipe(
      tap((creado) => {
        this._vehiculos.update((lista) => [...lista, creado]);
      })
    );
  }

  /**
   * Consumo HTTP PUT /api/vehiculos/{id} (Actualización)
   */
  actualizar(id: number, vehiculo: Partial<Vehiculo>): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.url}/${id}`, vehiculo).pipe(
      tap((actualizado) => {
        this._vehiculos.update((lista) =>
          lista.map((v) => (v.id === id ? actualizado : v))
        );
      })
    );
  }

  /**
   * Método polimórfico de guardado que despacha a POST o PUT según id
   */
  guardar(vehiculo: Partial<Vehiculo>): Observable<Vehiculo> {
    if (vehiculo.id) {
      return this.actualizar(vehiculo.id, vehiculo);
    } else {
      return this.crear(vehiculo);
    }
  }

  /**
   * Consumo HTTP DELETE /api/vehiculos/{id} (Eliminación)
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        this._vehiculos.update((lista) => lista.filter((v) => v.id !== id));
      })
    );
  }
}
