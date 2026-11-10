import { Component, OnInit, inject } from '@angular/core';
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

  // Formulario reactivo con validaciones rigurosas (Semana 13 - Formularios)
  form: FormGroup = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
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

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datos = {
      id: this.clienteId ?? undefined,
      ...this.form.value,
    };

    this.clienteService.guardar(datos);
    this.router.navigate(['/clientes']);
  }
}
