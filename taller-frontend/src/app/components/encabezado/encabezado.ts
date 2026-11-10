import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  // Enlaces declarativos con RouterLink y RouterLinkActive (Semana 12 - Slide 12)
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.scss',
})
export class Encabezado {
  // Inyección del servicio compartido con signals (Semana 12 - Slide 24 y 25)
  readonly favoritosService = inject(FavoritosService);
}
