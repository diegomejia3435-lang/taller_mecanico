import { Component, inject } from '@angular/core';
import { OrdenService } from '../../services/orden.service';

@Component({
  selector: 'app-historial-page',
  standalone: true,
  templateUrl: './historial.page.html',
  styleUrl: './historial.page.scss',
})
export class HistorialPage {
  readonly ordenService = inject(OrdenService);
}
