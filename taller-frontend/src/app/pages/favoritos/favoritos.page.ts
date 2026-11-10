import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
import { TallerService } from '../../services/taller.service';
import { TarjetaServicio } from '../../components/tarjeta-servicio/tarjeta-servicio';

@Component({
  selector: 'app-favoritos-page',
  standalone: true,
  imports: [RouterLink, TarjetaServicio],
  templateUrl: './favoritos.page.html',
  styleUrl: './favoritos.page.scss'
})
export class FavoritosPage {
  private router = inject(Router);
  readonly favoritosService = inject(FavoritosService);
  private tallerService = inject(TallerService);

  // Lista reactiva de servicios seleccionados como favoritos
  serviciosFavoritos = computed(() => {
    const ids = this.favoritosService.ids();
    return this.tallerService.obtenerTodos().filter((s) => ids.includes(s.id));
  });

  irDetalle(id: number): void {
    this.router.navigate(['/servicios', id]);
  }

  alternarFavorito(id: number): void {
    this.favoritosService.alternar(id);
  }

  limpiarTodos(): void {
    this.favoritosService.limpiar();
  }
}
