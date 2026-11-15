import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly errorMensaje = signal<string>('');
  readonly enviando = signal<boolean>(false);

  // Formulario reactivo con validaciones rigurosas (Semana 13 - UTP)
  readonly form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/.*\S.*/)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  ingresar(): void {
    if (this.enviando()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.enviando.set(true);
    this.errorMensaje.set('');

    const { username, password } = this.form.value;
    const u = (username as string).trim();
    const p = (password as string).trim();

    // Simulación de respuesta con validación de credenciales (DataInitializer)
    setTimeout(() => {
      if (u === 'admin' && p === '1234') {
        this.authService.login('admin', 'Administrador General', 'ADMIN');
        this.enviando.set(false);
        this.router.navigate(['/dashboard']);
      } else if (u === 'carlos' && p === '1234') {
        this.authService.login('carlos', 'Carlos Mendoza', 'MECANICO');
        this.enviando.set(false);
        this.router.navigate(['/dashboard']);
      } else if (u === '77777777' && p === '1234') {
        this.authService.login('77777777', 'Juan Pérez', 'CLIENTE');
        this.enviando.set(false);
        this.router.navigate(['/dashboard']);
      } else {
        this.enviando.set(false);
        this.errorMensaje.set('Usuario o contraseña incorrectos. Verifique sus credenciales de acceso.');
      }
    }, 200);
  }
}
