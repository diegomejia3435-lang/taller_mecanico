/**
 * Modelo de Cliente - Mapea a com.taller.entity.Cliente
 */
export interface Cliente {
  id?: number;
  nombreCompleto: string;
  dni: string;
  telefono?: string;
  correo?: string;
}
