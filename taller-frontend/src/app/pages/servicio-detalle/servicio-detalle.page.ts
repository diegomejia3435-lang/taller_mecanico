import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TallerService } from '../../services/taller.service';
import { FavoritosService } from '../../services/favoritos.service';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicio-detalle-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './servicio-detalle.page.html',
  styleUrl: './servicio-detalle.page.scss',
})
export class ServicioDetallePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tallerService = inject(TallerService);
  readonly favoritosService = inject(FavoritosService);

  // Señal para el ID capturado de la ruta (Semana 12 - Slide 14)
  readonly id = signal<number | null>(null);

  constructor() {
    // Lectura del parámetro de ruta :id con ActivatedRoute.paramMap (Slide 14)
    this.route.paramMap.subscribe((params) => {
      const rawId = params.get('id');
      this.id.set(rawId !== null ? Number(rawId) : null);
    });
  }

  // Servicio encontrado computado reactivamente
  readonly servicio = computed<Servicio | undefined>(() => {
    const currentId = this.id();
    return currentId !== null ? this.tallerService.buscarPorId(currentId) : undefined;
  });

  // Estado favorito para este servicio concreto
  readonly esFavorito = computed<boolean>(() => {
    const s = this.servicio();
    return s ? this.favoritosService.esFavorito(s.id) : false;
  });

  alternarFavorito(): void {
    const s = this.servicio();
    if (s) {
      this.favoritosService.alternar(s.id);
    }
  }

  // Navegación programática hacia el catálogo (Semana 12 - Slide 16)
  volver(): void {
    void this.router.navigate(['/servicios']);
  }
}
