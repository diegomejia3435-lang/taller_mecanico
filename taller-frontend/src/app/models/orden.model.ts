import { Vehiculo } from './vehiculo.model';
import { Usuario } from './usuario.model';
import { Servicio } from './servicio.model';

export type EstadoOrden = 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO' | 'CANCELADO';

/**
 * Modelo de Orden de Mantenimiento - Mapea a com.taller.entity.OrdenMantenimiento
 */
export interface OrdenMantenimiento {
  id?: number;
  vehiculo: Vehiculo;
  mecanico?: Usuario;
  fechaIngreso?: string;
  fechaSalida?: string;
  estado: EstadoOrden;
  diagnosticoTecnico?: string;
  servicios?: Servicio[];
  montoTotal?: number;
}
