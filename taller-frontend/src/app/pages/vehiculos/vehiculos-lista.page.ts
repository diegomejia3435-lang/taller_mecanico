import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../services/vehiculo.service';
import { NotificacionService } from '../../services/notificacion.service';
import { describirError } from '../../utils/http-error';

@Component({
  selector: 'app-vehiculos-lista-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './vehiculos-lista.page.html',
  styleUrl: './vehiculos-lista.page.scss',
})
export class VehiculosListaPage {
  readonly vehiculoService = inject(VehiculoService);
  private notificaciones = inject(NotificacionService);
  private router = inject(Router);

  terminoBusqueda = signal<string>('');

  vehiculosFiltrados = computed(() => {
    return this.vehiculoService.buscar(this.terminoBusqueda());
  });

  editar(id: number): void {
    this.router.navigate(['/vehiculos/editar', id]);
  }

  eliminar(id: number, placa: string): void {
    if (confirm(`¿Está seguro de eliminar el vehículo con placa "${placa}"?`)) {
      this.vehiculoService.eliminar(id).subscribe({
        next: () => this.notificaciones.exito(`Vehículo con placa ${placa} eliminado correctamente`),
        error: (err) => {
          const info = describirError(err);
          if ([400, 404, 409].includes(info.status)) {
            this.notificaciones.error(info.mensaje, info.titulo);
          }
          if (info.status === 404) {
            this.vehiculoService.cargar();
          }
        },
      });
    }
  }
}
