import { Injectable, computed, signal } from '@angular/core';

// Servicio compartido con Signals para gestión de estado único (Semana 12 - Slide 25)
@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  // Señal reactiva privada para los IDs de servicios favoritos
  private readonly _ids = signal<number[]>([]);

  // Exposición de señal como solo lectura
  readonly ids = this._ids.asReadonly();

  // Señal derivada computada reactivamente (Slide 25 y 26)
  readonly cantidad = computed(() => this.ids().length);

  // Alterna el estado favorito (añade si no está, remueve si ya existe)
  alternar(id: number): void {
    this._ids.update((actuales) =>
      actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id]
    );
  }

  // Verifica si un servicio concreto está marcado como favorito
  esFavorito(id: number): boolean {
    return this.ids().includes(id);
  }

  // Limpia todos los favoritos seleccionados
  limpiar(): void {
    this._ids.set([]);
  }
}
