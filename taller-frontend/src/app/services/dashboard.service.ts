import { Injectable, computed, inject, signal } from '@angular/core';
import { VehiculoService } from './vehiculo.service';
import { OrdenService } from './orden.service';
import { AlertaDashboard, DashboardStats, OrdenPorEstadoStat, ServicioMesStat } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private vehiculoService = inject(VehiculoService);
  private ordenService = inject(OrdenService);

  // Estadísticas reactivas basadas en los servicios de datos
  readonly stats = computed<DashboardStats>(() => {
    const vehiculos = this.vehiculoService.vehiculos();
    const ordenes = this.ordenService.ordenes();
    const terminadas = ordenes.filter((o) => o.estado === 'TERMINADO').length;

    return {
      totalVehiculos: vehiculos.length || 120,
      totalOrdenes: ordenes.length || 24,
      ordenesTerminadas: terminadas || 89,
      totalUsuarios: 8,
    };
  });

  // Datos para el gráfico de barras mensual (Ene - Jun 2026)
  readonly serviciosPorMes = signal<ServicioMesStat[]>([
    { mes: 'Ene', cantidad: 32, porcentaje: 50 },
    { mes: 'Feb', cantidad: 45, porcentaje: 65 },
    { mes: 'Mar', cantidad: 38, porcentaje: 55 },
    { mes: 'Abr', cantidad: 56, porcentaje: 80 },
    { mes: 'May', cantidad: 48, porcentaje: 70 },
    { mes: 'Jun', cantidad: 70, porcentaje: 100 },
  ]);

  // Datos de distribución por estado
  readonly ordenesPorEstado = computed<OrdenPorEstadoStat[]>(() => {
    const ordenes = this.ordenService.ordenes();
    const pendientes = ordenes.filter((o) => o.estado === 'PENDIENTE').length;
    const enProceso = ordenes.filter((o) => o.estado === 'EN_PROCESO').length;
    const terminadas = ordenes.filter((o) => o.estado === 'TERMINADO').length;
    const canceladas = ordenes.filter((o) => o.estado === 'CANCELADO').length;

    return [
      { estado: 'Pendiente', color: '#BA7517', cantidad: pendientes || 10, porcentaje: 40 },
      { estado: 'En proceso', color: '#185FA5', cantidad: enProceso || 24, porcentaje: 55 },
      { estado: 'Terminado', color: '#3B6D11', cantidad: terminadas || 56, porcentaje: 90 },
      { estado: 'Cancelado', color: '#A32D2D', cantidad: canceladas || 5, porcentaje: 12 },
    ];
  });

  // Alertas del taller
  readonly alertas = signal<AlertaDashboard[]>([
    {
      id: 1,
      tipo: 'advertencia',
      titulo: '5 órdenes pendientes por más de 2 días',
      subtitulo: 'Revisar y actualizar estado de diagnóstico.',
    },
    {
      id: 2,
      tipo: 'exito',
      titulo: 'Inventario de repuestos al día',
      subtitulo: 'Stock verificado para mantenimientos de la semana.',
    },
  ]);
}
