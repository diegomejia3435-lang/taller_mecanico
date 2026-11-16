import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdenService } from '../../services/orden.service';
import { EstadoOrden } from '../../models/orden.model';
import { NotificacionService } from '../../services/notificacion.service';
import { describirError } from '../../utils/http-error';

@Component({
  selector: 'app-ordenes-lista-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './ordenes-lista.page.html',
  styleUrl: './ordenes-lista.page.scss',
})
export class OrdenesListaPage {
  readonly ordenService = inject(OrdenService);
  private notificaciones = inject(NotificacionService);
  private router = inject(Router);

  filtroTexto = signal<string>('');
  filtroEstado = signal<string>('TODOS');

  ordenesFiltradas = computed(() => {
    return this.ordenService.filtrar(this.filtroTexto(), this.filtroEstado());
  });

  editar(id: number): void {
    this.router.navigate(['/ordenes/editar', id]);
  }

  cambiarEstado(id: number, nuevoEstado: string): void {
    this.ordenService.cambiarEstado(id, nuevoEstado as EstadoOrden).subscribe({
      next: () => this.notificaciones.exito(`Estado de la orden #${id} actualizado a ${nuevoEstado}`),
      error: (err) => {
        const info = describirError(err);
        this.notificaciones.error(info.mensaje, info.titulo);
      },
    });
  }

  eliminar(id: number): void {
    if (confirm(`¿Está seguro de anular la orden de trabajo #${id}?`)) {
      this.ordenService.eliminar(id).subscribe({
        next: () => this.notificaciones.exito(`Orden #${id} anulada correctamente`),
        error: (err) => {
          const info = describirError(err);
          if ([400, 404, 409].includes(info.status)) {
            this.notificaciones.error(info.mensaje, info.titulo);
          }
          if (info.status === 404) {
            this.ordenService.cargar();
          }
        },
      });
    }
  }
}
