import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  readonly authService = inject(AuthService);
  private router = inject(Router);

  // Fecha actual formateada (ej: 13 de mayo de 2026)
  fechaHoy = new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
