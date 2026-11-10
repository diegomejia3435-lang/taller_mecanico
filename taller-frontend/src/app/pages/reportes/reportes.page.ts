import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  templateUrl: './reportes.page.html',
  styleUrl: './reportes.page.scss',
})
export class ReportesPage {
  serviciosTop = [
    { nombre: 'Mantenimiento Preventivo Básico', total: 42, ingresos: 5040.0 },
    { nombre: 'Alineación y Balanceo Láser', total: 35, ingresos: 2800.0 },
    { nombre: 'Servicio Integral de Frenos', total: 28, ingresos: 4200.0 },
    { nombre: 'Afinamiento Electrónico', total: 19, ingresos: 3990.0 },
  ];
}
