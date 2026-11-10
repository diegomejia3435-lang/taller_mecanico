import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TallerService } from '../../services/taller.service';
import { FavoritosService } from '../../services/favoritos.service';
import { TarjetaServicio } from '../../components/tarjeta-servicio/tarjeta-servicio';

@Component({
  selector: 'app-servicios-page',
  standalone: true,
  imports: [TarjetaServicio],
  templateUrl: './servicios.page.html',
  styleUrl: './servicios.page.scss',
})
export class ServiciosPage {
  private readonly tallerService = inject(TallerService);
  readonly favoritosService = inject(FavoritosService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Señal reactiva para el texto de búsqueda (Semana 12 - Slide 26)
  readonly busqueda = signal<string>('');

  // Señal para la categoría seleccionada
  readonly categoriaSeleccionada = signal<string>('Todas');

  // Categorías automotrices disponibles
  readonly categorias = ['Todas', 'Mantenimiento', 'Suspensión', 'Electrónica', 'Frenos', 'Motor', 'Climatización'];

  // Lectura del Query Parameter ?q=... (Semana 12 - Slide 15)
  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q');
      if (q !== null) {
        this.busqueda.set(q);
      }
    });
  }

  // Lista de servicios filtrados computada reactivamente
  readonly filtrados = computed(() => {
    let lista = this.tallerService.filtrar(this.busqueda());
    const cat = this.categoriaSeleccionada();
    if (cat !== 'Todas') {
      lista = lista.filter((s) => s.categoria.toLowerCase() === cat.toLowerCase());
    }
    return lista;
  });

  // Actualiza la búsqueda y sincroniza opcionalmente con el Query Parameter en la URL
  onBuscar(texto: string): void {
    this.busqueda.set(texto);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: texto ? { q: texto } : {},
      queryParamsHandling: 'merge',
    });
  }

  onSeleccionarCategoria(cat: string): void {
    this.categoriaSeleccionada.set(cat);
  }

  // Navegación programática hacia ruta parametrizada /servicios/:id (Semana 12 - Slide 16)
  irDetalle(id: number): void {
    void this.router.navigate(['/servicios', id]);
  }
}
