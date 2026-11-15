import { Cliente } from './cliente.model';

/**
 * Modelo de Vehículo - Mapea a com.taller.entity.Vehiculo
 */
export interface Vehiculo {
  id?: number;
  placa: string;
  marca: string;
  modelo?: string;
  anio?: number;
  tipoMotor?: string;
  cliente?: Cliente;
}
