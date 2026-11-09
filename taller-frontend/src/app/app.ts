import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Encabezado } from './components/encabezado/encabezado';
import { TarjetaServicio } from './components/tarjeta-servicio/tarjeta-servicio';
import { Servicio } from './models/servicio.model';

@Component({
  selector: 'app-root',
  standalone: true,
  // Dependencias explícitas en standalone (Semana 11 - Slide 10 y 15)
  imports: [Encabezado, TarjetaServicio, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Estado reactivo con Signals (Semana 11 - Slide 16 y 17)
  contador = signal<number>(0);

  // Catálogo de servicios del taller automotriz (Semana 11 - Slide 09 y 26)
  servicios = signal<Servicio[]>([
    {
      id: 1,
      nombre: 'Mantenimiento Preventivo Básico',
      descripcion: 'Cambio de aceite sintético, filtro de aceite, filtro de aire y revisión de niveles.',
      precioBase: 120.00,
      disponible: true,
      icono: '🔧',
      categoria: 'Mantenimiento',
    },
    {
      id: 2,
      nombre: 'Alineación y Balanceo Computarizado',
      descripcion: 'Calibración láser de geometría de suspensión y balanceo en 4 ruedas.',
      precioBase: 80.00,
      disponible: true,
      icono: '⚙️',
      categoria: 'Suspensión',
    },
    {
      id: 3,
      nombre: 'Diagnóstico Electrónico por Scanner',
      descripcion: 'Lectura completa de códigos OBD-II, borrado de check engine y prueba de sensores.',
      precioBase: 95.00,
      disponible: true,
      icono: '💻',
      categoria: 'Electrónica',
    },
    {
      id: 4,
      nombre: 'Servicio Integral de Frenos',
      descripcion: 'Cambio de pastillas, rectificado de discos, purga y líquido DOT 4.',
      precioBase: 150.00,
      disponible: true,
      icono: '🛑',
      categoria: 'Frenos',
    },
    {
      id: 5,
      nombre: 'Afinamiento Electrónico de Motor',
      descripcion: 'Limpieza de inyectores por ultrasonido, cambio de bujías y cuerpo de aceleración.',
      precioBase: 210.00,
      disponible: true,
      icono: '⚡',
      categoria: 'Motor',
    },
    {
      id: 6,
      nombre: 'Recarga y Detección de Fugas de A/C',
      descripcion: 'Carga de gas ecológico R134a, prueba de vacío y cambio de filtro de cabina.',
      precioBase: 130.00,
      disponible: false, // Demuestra estado No Disponible (Semana 11 - Slide 28 Reto B)
      icono: '❄️',
      categoria: 'Climatización',
    },
  ]);

  // Manejo de eventos hijo -> padre con output() (Semana 11 - Slide 17)
  agregarServicio(servicio: Servicio): void {
    this.contador.update((valor) => valor + 1);
  }

  limpiarServicios(): void {
    this.contador.set(0);
  }
}
