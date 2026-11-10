import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-mecanicos-page',
  standalone: true,
  templateUrl: './mecanicos.page.html',
  styleUrl: './mecanicos.page.scss',
})
export class MecanicosPage {
  mecanicos = signal([
    { id: 1, nombre: 'Carlos Mendoza', especialidad: 'Motor y Frenos', telefono: '999888777', estado: 'Activo', ordenes: 5 },
    { id: 2, nombre: 'Jorge Huamán', especialidad: 'Electrónica y Scanner', telefono: '988777666', estado: 'Activo', ordenes: 3 },
    { id: 3, nombre: 'Miguel Prado', especialidad: 'Suspensión y Alineación', telefono: '977666555', estado: 'Activo', ordenes: 4 },
    { id: 4, nombre: 'Andrés Vera', especialidad: 'Climatización A/C', telefono: '966555444', estado: 'Inactivo', ordenes: 0 },
  ]);
}
