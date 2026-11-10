import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TallerService } from '../../services/taller.service';
import { FavoritosService } from '../../services/favoritos.service';
import { TarjetaServicio } from '../../components/tarjeta-servicio/tarjeta-servicio';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [RouterLink, TarjetaServicio],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.scss',
})
export class InicioPage {
  readonly tallerService = inject(TallerService);
  readonly favoritosService = inject(FavoritosService);

  // Muestra 3 servicios destacados en el Dashboard
  readonly destacados = this.tallerService.servicios().slice(0, 3);
}
