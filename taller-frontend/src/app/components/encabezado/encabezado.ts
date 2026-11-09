import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.scss',
})
export class Encabezado {
  titulo = input<string>('Taller Mecánico UTP');
  subtitulo = input<string>('Sistema Integrado de Servicios y Mantenimiento');
  contador = input<number>(0);

  limpiar = output<void>();

  onLimpiar(): void {
    this.limpiar.emit();
  }
}
