/**
 * Métricas e información estadística del Dashboard del Taller
 */
export interface DashboardStats {
  totalVehiculos: number;
  totalOrdenes: number;
  ordenesTerminadas: number;
  totalUsuarios: number;
}

export interface AlertaDashboard {
  id: number;
  tipo: 'advertencia' | 'exito' | 'info';
  titulo: string;
  subtitulo: string;
}

export interface OrdenPorEstadoStat {
  estado: string;
  color: string;
  cantidad: number;
  porcentaje: number;
}

export interface ServicioMesStat {
  mes: string;
  cantidad: number;
  porcentaje: number;
}
