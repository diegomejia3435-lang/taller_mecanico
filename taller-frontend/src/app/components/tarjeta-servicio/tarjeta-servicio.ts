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
  // Comunicación Padre -> Hijo: input() (Semana 11 - Slide 16)
  servicio = input.required<Servicio>();

  // Comunicación Hijo -> Padre: output() (Semana 11 - Slide 17)
  solicitar = output<Servicio>();

  onSolicitar(): void {
    if (this.servicio().disponible) {
      this.solicitar.emit(this.servicio());
    }
  }
}
