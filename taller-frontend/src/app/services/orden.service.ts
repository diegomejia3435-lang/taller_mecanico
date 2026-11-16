import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoOrden, OrdenMantenimiento } from '../models/orden.model';

@Injectable({
  providedIn: 'root',
})
export class OrdenService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/ordenes`;

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
  readonly cargando = signal<boolean>(false);
  readonly error = signal<string>('');

  constructor() {
    this.cargar();
  }

  /**
   * Carga reactiva de órdenes consultando la API REST de Spring Boot (GET /api/ordenes)
   */
  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.http.get<OrdenMantenimiento[]>(this.url).subscribe({
      next: (datos) => {
        if (datos && datos.length > 0) {
          this._ordenes.set(datos);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con la API REST de Órdenes en Spring Boot.');
        this.cargando.set(false);
      },
    });
  }

  /**
   * Consumo HTTP GET /api/ordenes
   */
  listar(): Observable<OrdenMantenimiento[]> {
    return this.http.get<OrdenMantenimiento[]>(this.url).pipe(
      tap((datos) => this._ordenes.set(datos))
    );
  }

  /**
   * Consumo HTTP GET /api/ordenes/{id}
   */
  buscarPorId(id: number): Observable<OrdenMantenimiento> {
    return this.http.get<OrdenMantenimiento>(`${this.url}/${id}`);
  }

  /**
   * Búsqueda síncrona en caché reactiva para Signals y formularios
   */
  buscarPorIdLocal(id: number): OrdenMantenimiento | undefined {
    return this.ordenes().find((o) => o.id === id);
  }

  /**
   * Consumo HTTP GET /api/ordenes/estadisticas/por-estado (JPQL GROUP BY)
   */
  obtenerEstadisticasPorEstado(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/estadisticas/por-estado`);
  }

  /**
   * Consumo HTTP POST /api/ordenes/transacciones/reemplazar-mecanico (Operación atómica @Transactional)
   */
  reemplazarMecanico(ordenId: number, nuevoMecanicoId: number): Observable<OrdenMantenimiento> {
    return this.http.post<OrdenMantenimiento>(
      `${this.url}/transacciones/reemplazar-mecanico?ordenId=${ordenId}&nuevoMecanicoId=${nuevoMecanicoId}`,
      {}
    ).pipe(
      tap((actualizada) => {
        this._ordenes.update((lista) =>
          lista.map((o) => (o.id === ordenId ? actualizada : o))
        );
      })
    );
  }

  /**
   * Filtro reactivo local para búsqueda interactiva en tiempo real
   */
  filtrar(termino?: string, estado?: string): OrdenMantenimiento[] {
    let resultado = this.ordenes();

    if (estado && estado.trim() !== '' && estado !== 'TODOS') {
      resultado = resultado.filter((o) => o.estado === estado);
    }

    if (termino && termino.trim() !== '') {
      const t = termino.toLowerCase().trim();
      resultado = resultado.filter(
        (o) =>
          o.vehiculo?.placa?.toLowerCase().includes(t) ||
          o.vehiculo?.marca?.toLowerCase().includes(t) ||
          o.vehiculo?.cliente?.nombreCompleto?.toLowerCase().includes(t) ||
          o.mecanico?.nombreCompleto?.toLowerCase().includes(t) ||
          o.diagnosticoTecnico?.toLowerCase().includes(t) ||
          String(o.id).includes(t)
      );
    }

    return resultado;
  }

  /**
   * Consumo HTTP POST /api/ordenes (Registro)
   */
  crear(orden: Partial<OrdenMantenimiento>): Observable<OrdenMantenimiento> {
    return this.http.post<OrdenMantenimiento>(this.url, orden).pipe(
      tap((creada) => {
        this._ordenes.update((lista) => [...lista, creada]);
      })
    );
  }

  /**
   * Consumo HTTP PUT /api/ordenes/{id} (Actualización)
   */
  actualizar(id: number, orden: Partial<OrdenMantenimiento>): Observable<OrdenMantenimiento> {
    return this.http.put<OrdenMantenimiento>(`${this.url}/${id}`, orden).pipe(
      tap((actualizada) => {
        this._ordenes.update((lista) =>
          lista.map((o) => (o.id === id ? actualizada : o))
        );
      })
    );
  }

  /**
   * Guardado polimórfico (POST o PUT)
   */
  guardar(orden: Partial<OrdenMantenimiento>): Observable<OrdenMantenimiento> {
    if (orden.id) {
      return this.actualizar(orden.id, orden);
    } else {
      return this.crear(orden);
    }
  }

  /**
   * Consumo HTTP DELETE /api/ordenes/{id}
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        this._ordenes.update((lista) => lista.filter((o) => o.id !== id));
      })
    );
  }

  /**
   * Transición de estados de la orden con persistencia HTTP PUT
   */
  cambiarEstado(id: number, nuevoEstado: EstadoOrden): Observable<OrdenMantenimiento> {
    const ordenActual = this.buscarPorIdLocal(id);
    const ahora = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const actualizacion: Partial<OrdenMantenimiento> = {
      ...(ordenActual || {}),
      id,
      estado: nuevoEstado,
      fechaSalida: nuevoEstado === 'TERMINADO' ? ahora : undefined,
    };

    return this.actualizar(id, actualizacion);
  }
}
