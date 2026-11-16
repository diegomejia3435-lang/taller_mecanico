import { Component, inject } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  template: `
    <div class="toasts" aria-live="polite">
      @for (n of notificaciones.lista(); track n.id) {
        <div class="toast toast--{{ n.tipo }}" role="alert">
          <div class="toast__texto">
            <strong>{{ n.titulo }}</strong>
            <span>{{ n.mensaje }}</span>
          </div>
          <button type="button" class="toast__cerrar" aria-label="Cerrar" (click)="notificaciones.cerrar(n.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toasts { position: fixed; top: 20px; right: 20px; z-index: 2000; display: flex; flex-direction: column; gap: 10px; width: 360px; max-width: 90vw; }
    .toast { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 10px; border-left: 4px solid; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12); font-size: 0.85rem; }
    .toast__texto { display: flex; flex-direction: column; gap: 2px; }
    .toast--error { background: #FCEBEB; color: #A32D2D; border-color: #A32D2D; }
    .toast--exito { background: #EAF3DE; color: #3B6D11; border-color: #3B6D11; }
    .toast--advertencia { background: #FAEEDA; color: #854F0B; border-color: #BA7517; }
    .toast__cerrar { background: none; border: none; font-size: 1.2rem; line-height: 1; cursor: pointer; color: inherit; }
  `],
})
export class Toasts {
  readonly notificaciones = inject(NotificacionService);
}