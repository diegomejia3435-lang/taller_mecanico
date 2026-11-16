import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { NotificacionService } from '../../services/notificacion.service';
import { describirError } from '../../utils/http-error';

@Component({
  selector: 'app-clientes-lista-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './clientes-lista.page.html',
  styleUrl: './clientes-lista.page.scss',
})
export class ClientesListaPage {
  readonly clienteService = inject(ClienteService);
  private router = inject(Router);
  private notificaciones = inject(NotificacionService);

  terminoBusqueda = signal<string>('');

  clientesFiltrados = computed(() => {
    return this.clienteService.buscar(this.terminoBusqueda());
  });

  editar(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

   eliminar(id: number, nombre: string): void {
    if (confirm(`¿Está seguro de eliminar al cliente "${nombre}"?`)) {
      this.clienteService.eliminar(id).subscribe({
        next: () => this.notificaciones.exito('Cliente eliminado correctamente'),
        error: (err) => {
          const info = describirError(err);
          if ([400, 404, 409].includes(info.status)) {
            this.notificaciones.error(info.mensaje, info.titulo);
          }
          if (info.status === 404) {
            this.clienteService.cargar();
          }
        },
      });
    }
  }
}
