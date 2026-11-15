export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: number;
  disponible: boolean;
  icono: string;
  categoria: string;
  tiempoEstimado: string;
  garantia: string;
  incluye: string[];
}
