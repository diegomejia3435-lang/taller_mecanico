/**
 * Modelo de Rol y Usuario - Mapea a com.taller.entity.Rol y com.taller.entity.Usuario
 */
export interface Rol {
  id?: number;
  nombre: string;
}

export interface Usuario {
  id?: number;
  username: string;
  nombreCompleto?: string;
  especialidad?: string;
  telefono?: string;
  estado?: string;
  rol?: Rol;
}
