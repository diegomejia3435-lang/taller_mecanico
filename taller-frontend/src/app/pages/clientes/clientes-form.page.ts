import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes-form-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './clientes-form.page.html',
  styleUrl: './clientes-form.page.scss',
})
export class ClientesFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clienteId: number | null = null;
  esEdicion = false;
  readonly enviando = signal(false);
  readonly errorServidor = signal('');

  // Formulario reactivo con validaciones rigurosas (Semana 13 - UTP)
  readonly form: FormGroup = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/.*\S.*/)]],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    telefono: ['', [Validators.pattern(/^[0-9]{9}$/)]],
    correo: ['', [Validators.email]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = Number(idParam);
      const cliente = this.clienteService.buscarPorId(this.clienteId);
      if (cliente) {
        this.esEdicion = true;
        this.form.patchValue({
          nombreCompleto: cliente.nombreCompleto,
          dni: cliente.dni,
          telefono: cliente.telefono || '',
          correo: cliente.correo || '',
        });
      } else {
        this.router.navigate(['/clientes']);
      }
    }
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  guardar(): void {
    if (this.enviando()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.enviando.set(true);
    this.errorServidor.set('');

    const datos = {
      id: this.clienteId ?? undefined,
      nombreCompleto: this.form.value.nombreCompleto?.trim(),
      dni: this.form.value.dni?.trim(),
      telefono: this.form.value.telefono?.trim() || null,
      correo: this.form.value.correo?.trim() || null,
    };

    try {
      this.clienteService.guardar(datos);
      this.enviando.set(false);
      this.router.navigate(['/clientes']);
    } catch {
      this.enviando.set(false);
      this.errorServidor.set('Error al procesar el registro del cliente.');
    }
  }

  limpiar(): void {
    this.form.reset({
      nombreCompleto: '',
      dni: '',
      telefono: '',
      correo: '',
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.errorServidor.set('');
  }
}
