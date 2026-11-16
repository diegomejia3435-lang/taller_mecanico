import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/clientes`;

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
  readonly cargando = signal<boolean>(false);
  readonly error = signal<string>('');

  constructor() {
    this.cargar();
  }

  /**
   * Carga reactiva de clientes consultando la API REST de Spring Boot (GET /api/clientes)
   */
  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.http.get<Cliente[]>(this.url).subscribe({
      next: (datos) => {
        if (datos && datos.length > 0) {
          this._clientes.set(datos);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con la API REST de Clientes en Spring Boot.');
        this.cargando.set(false);
      },
    });
  }

  /**
   * Consumo HTTP GET /api/clientes
   */
  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url).pipe(
      tap((datos) => this._clientes.set(datos))
    );
  }

  /**
   * Consumo HTTP GET /api/clientes/{id}
   */
  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  /**
   * Búsqueda síncrona en caché reactiva para Signals y computed()
   */
  buscarPorIdLocal(id: number): Cliente | undefined {
    return this.clientes().find((c) => c.id === id);
  }

  /**
   * Consumo HTTP GET /api/clientes/buscar?texto={texto} (Consulta JPQL LIKE en Spring Boot)
   */
  buscarPorTextoApi(texto: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.url}/buscar?texto=${encodeURIComponent(texto)}`);
  }

  /**
   * Filtro reactivo local para búsqueda interactiva en tiempo real
   */
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

  /**
   * Consumo HTTP POST /api/clientes (Registro)
   */
  crear(cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, cliente).pipe(
      tap((creado) => {
        this._clientes.update((lista) => [...lista, creado]);
      })
    );
  }

  /**
   * Consumo HTTP PUT /api/clientes/{id} (Actualización)
   */
  actualizar(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/${id}`, cliente).pipe(
      tap((actualizado) => {
        this._clientes.update((lista) =>
          lista.map((c) => (c.id === id ? actualizado : c))
        );
      })
    );
  }

  /**
   * Método polimórfico de guardado que despacha a POST o PUT según id
   */
  guardar(cliente: Partial<Cliente>): Observable<Cliente> {
    if (cliente.id) {
      return this.actualizar(cliente.id, cliente);
    } else {
      return this.crear(cliente);
    }
  }

  /**
   * Consumo HTTP DELETE /api/clientes/{id} (Eliminación)
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        this._clientes.update((lista) => lista.filter((c) => c.id !== id));
      })
    );
  }
}
