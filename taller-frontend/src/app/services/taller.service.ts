import { Injectable, signal } from '@angular/core';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root',
})
export class TallerService {
  // Catálogo completo de servicios automotrices con signals
  private readonly _servicios = signal<Servicio[]>([
    {
      id: 1,
      nombre: 'Mantenimiento Preventivo Básico',
      descripcion: 'Cambio de aceite sintético 5W-30, filtro de aceite, filtro de aire y revisión de 25 puntos de seguridad.',
      precioBase: 120.0,
      disponible: true,
      icono: '🔧',
      categoria: 'Mantenimiento',
      tiempoEstimado: '1 hora 30 min',
      garantia: '3 meses o 5,000 km',
      incluye: [
        'Aceite sintético de alta gama (hasta 4 cuartos)',
        'Filtro de aceite original o equivalente',
        'Filtro de aire de motor',
        'Inspección de niveles de fluidos',
        'Revisión visual de suspensión y frenos',
      ],
    },
    {
      id: 2,
      nombre: 'Alineación Láser y Balanceo',
      descripcion: 'Calibración computarizada en 3D de ángulos de convergencia, caída y avance para 4 ruedas.',
      precioBase: 80.0,
      disponible: true,
      icono: '⚙️',
      categoria: 'Suspensión',
      tiempoEstimado: '1 hora',
      garantia: '1 mes o 2,000 km',
      incluye: [
        'Alineación láser delantera y trasera',
        'Balanceo dinámico de 4 neumáticos con plomos ecológicos',
        'Inspección de terminales de dirección y rótulas',
        'Calibración de presión de inflado con nitrógeno opcional',
      ],
    },
    {
      id: 3,
      nombre: 'Diagnóstico Electrónico por Scanner',
      descripcion: 'Escaneo completo multimarcas de módulos ECM, TCM, ABS, Airbags y lectura de flujo de datos en vivo.',
      precioBase: 95.0,
      disponible: true,
      icono: '💻',
      categoria: 'Electrónica',
      tiempoEstimado: '45 minutos',
      garantia: 'Informe técnico impreso y digital',
      incluye: [
        'Lectura y borrado de códigos de falla OBD-II (DTC)',
        'Prueba activa de actuadores y bombas',
        'Monitoreo de sensores de oxígeno y mezcla aire/combustible',
        'Prueba de salud del alternador y batería',
      ],
    },
    {
      id: 4,
      nombre: 'Servicio Integral de Frenos',
      descripcion: 'Reemplazo de pastillas cerámicas, rectificado de discos de freno, purga y cambio de líquido DOT 4.',
      precioBase: 150.0,
      disponible: true,
      icono: '🛑',
      categoria: 'Frenos',
      tiempoEstimado: '2 horas',
      garantia: '6 meses o 10,000 km',
      incluye: [
        'Juego de pastillas de freno delanteras de alta fricción',
        'Rectificado de precisión de discos en torno',
        'Limpieza y lubricación de calipers y mordazas',
        'Reemplazo total de líquido de frenos DOT 4',
      ],
    },
    {
      id: 5,
      nombre: 'Afinamiento Electrónico de Motor',
      descripcion: 'Limpieza de inyectores en tina de ultrasonido, calibración de bujías y lavado de cuerpo de aceleración.',
      precioBase: 210.0,
      disponible: true,
      icono: '⚡',
      categoria: 'Motor',
      tiempoEstimado: '3 horas',
      garantia: '6 meses o 10,000 km',
      incluye: [
        'Limpieza y prueba de caudal de inyectores por ultrasonido',
        'Juego de bujías de iridio o cobre calibradas',
        'Limpieza de obturador y cuerpo de aceleración',
        'Reemplazo de filtro de gasolina',
      ],
    },
    {
      id: 6,
      nombre: 'Mantenimiento y Carga de Aire Acondicionado',
      descripcion: 'Recuperación, vacío del sistema, recarga de gas ecológico R134a y desinfección con ozono.',
      precioBase: 130.0,
      disponible: false, // Simula estado no disponible (Semana 11 - Slide 28)
      icono: '❄️',
      categoria: 'Climatización',
      tiempoEstimado: '1 hora 15 min',
      garantia: '3 meses',
      incluye: [
        'Prueba de vacío y detección de microfugas con tinte UV',
        'Carga exacta por peso de refrigerante ecológico',
        'Adición de aceite sintético PAG para compresor',
        'Sanitización de conductos y filtro de polen',
      ],
    },
  ]);

  readonly servicios = this._servicios.asReadonly();

  // Obtener catálogo completo
  obtenerTodos(): Servicio[] {
    return this.servicios();
  }

  // Búsqueda por ID para rutas parametrizadas /servicios/:id
  buscarPorId(id: number): Servicio | undefined {
    return this.servicios().find((s) => s.id === id);
  }

  // Filtrado por query parameter ?q=... (Semana 12 - Slide 15)
  filtrar(query: string): Servicio[] {
    if (!query || !query.trim()) {
      return this.servicios();
    }
    const q = query.toLowerCase().trim();
    return this.servicios().filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        s.categoria.toLowerCase().includes(q) ||
        s.descripcion.toLowerCase().includes(q)
    );
  }
}
