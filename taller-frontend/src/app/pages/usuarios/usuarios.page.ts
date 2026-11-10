import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  templateUrl: './usuarios.page.html',
  styleUrl: './usuarios.page.scss',
})
export class UsuariosPage {
  usuarios = signal([
    { id: 1, username: 'admin', nombreCompleto: 'Administrador General', rol: 'ROLE_ADMIN', estado: 'Activo' },
    { id: 2, username: 'carlos', nombreCompleto: 'Carlos Mendoza', rol: 'ROLE_MECANICO', estado: 'Activo' },
    { id: 3, username: '77777777', nombreCompleto: 'Juan Pérez', rol: 'ROLE_CLIENTE', estado: 'Activo' },
  ]);
}
