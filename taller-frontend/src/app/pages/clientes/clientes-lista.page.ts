import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

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

  terminoBusqueda = signal<string>('');

  clientesFiltrados = computed(() => {
    return this.clienteService.buscar(this.terminoBusqueda());
  });

  editar(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  eliminar(id: number, nombre: string): void {
    if (confirm(`¿Está seguro de eliminar al cliente "${nombre}"?`)) {
      this.clienteService.eliminar(id);
    }
  }
}
