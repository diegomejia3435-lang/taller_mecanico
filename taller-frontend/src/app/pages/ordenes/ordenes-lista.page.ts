import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdenService } from '../../services/orden.service';
import { EstadoOrden } from '../../models/orden.model';

@Component({
  selector: 'app-ordenes-lista-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './ordenes-lista.page.html',
  styleUrl: './ordenes-lista.page.scss',
})
export class OrdenesListaPage {
  readonly ordenService = inject(OrdenService);
  private router = inject(Router);

  filtroTexto = signal<string>('');
  filtroEstado = signal<string>('TODOS');

  ordenesFiltradas = computed(() => {
    return this.ordenService.filtrar(this.filtroTexto(), this.filtroEstado());
  });

  cambiarEstado(id: number, nuevoEstado: string): void {
    this.ordenService.cambiarEstado(id, nuevoEstado as EstadoOrden);
  }

  eliminar(id: number): void {
    if (confirm(`¿Está seguro de anular la orden de trabajo #${id}?`)) {
      this.ordenService.eliminar(id);
    }
  }
}
