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

  errorMensaje = signal<string>('');

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.value;

    // Validación y autenticación (DataInitializer: admin/1234, carlos/1234, 77777777/1234)
    if (username === 'admin' && password === '1234') {
      this.authService.login('admin', 'Administrador General', 'ADMIN');
      this.router.navigate(['/dashboard']);
    } else if (username === 'carlos' && password === '1234') {
      this.authService.login('carlos', 'Carlos Mendoza', 'MECANICO');
      this.router.navigate(['/dashboard']);
    } else if (username === '77777777' && password === '1234') {
      this.authService.login('77777777', 'Juan Pérez', 'CLIENTE');
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMensaje.set('Usuario o contraseña incorrectos. Verifique sus credenciales.');
    }
  }
}
