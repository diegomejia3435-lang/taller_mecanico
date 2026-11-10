import { Component, input, output } from '@angular/core';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-tarjeta-servicio',
  standalone: true,
  imports: [],
  templateUrl: './tarjeta-servicio.html',
  styleUrl: './tarjeta-servicio.scss',
})
export class TarjetaServicio {
  // Comunicación Padre -> Hijo: input() (Semana 12 - Slide 21)
  readonly servicio = input.required<Servicio>();
  readonly esFavorito = input<boolean>(false);

  // Comunicación Hijo -> Padre: output() (Semana 12 - Slide 22)
  readonly verDetalle = output<number>();
  readonly alternarFavorito = output<number>();

  onVerDetalle(): void {
    this.verDetalle.emit(this.servicio().id);
  }

  onAlternarFavorito(): void {
    this.alternarFavorito.emit(this.servicio().id);
  }
}
