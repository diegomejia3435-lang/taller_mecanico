import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-exportar-page',
  standalone: true,
  templateUrl: './exportar.page.html',
  styleUrl: './exportar.page.scss',
})
export class ExportarPage {
  mensajeDescarga = signal<string>('');

  exportar(modulo: string, formato: 'PDF' | 'Excel'): void {
    this.mensajeDescarga.set(`Generando archivo ${formato} de ${modulo}... La descarga comenzará en breve.`);
    setTimeout(() => {
      this.mensajeDescarga.set('');
    }, 4000);
  }
}
