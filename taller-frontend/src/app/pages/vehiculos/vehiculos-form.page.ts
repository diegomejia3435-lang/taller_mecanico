import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehiculoService } from '../../services/vehiculo.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-vehiculos-form-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './vehiculos-form.page.html',
  styleUrl: './vehiculos-form.page.scss',
})
export class VehiculosFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  readonly clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  vehiculoId: number | null = null;
  esEdicion = false;
  readonly enviando = signal(false);
  readonly errorServidor = signal('');

  // Formulario reactivo con validaciones rigurosas (Semana 13 - UTP)
  readonly form: FormGroup = this.fb.group({
    placa: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/),
      ],
    ],
    marca: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/.*\S.*/)]],
    modelo: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/.*\S.*/)]],
    anio: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(1980), Validators.max(2027)],
    ],
    tipoMotor: ['Gasolina', [Validators.required]],
    clienteId: [null, [Validators.required]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.vehiculoId = Number(idParam);
      const vehiculo = this.vehiculoService.buscarPorId(this.vehiculoId);
      if (vehiculo) {
        this.esEdicion = true;
        this.form.patchValue({
          placa: vehiculo.placa,
          marca: vehiculo.marca,
          modelo: vehiculo.modelo || '',
          anio: vehiculo.anio || new Date().getFullYear(),
          tipoMotor: vehiculo.tipoMotor || 'Gasolina',
          clienteId: vehiculo.cliente?.id || null,
        });
      } else {
        this.router.navigate(['/vehiculos']);
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

    const { placa, marca, modelo, anio, tipoMotor, clienteId } = this.form.value;
    const clienteSeleccionado = this.clienteService.buscarPorId(Number(clienteId));

    const datos = {
      id: this.vehiculoId ?? undefined,
      placa: (placa as string).trim().toUpperCase(),
      marca: (marca as string).trim(),
      modelo: (modelo as string).trim(),
      anio: Number(anio),
      tipoMotor,
      cliente: clienteSeleccionado,
    };

    try {
      this.vehiculoService.guardar(datos);
      this.enviando.set(false);
      this.router.navigate(['/vehiculos']);
    } catch {
      this.enviando.set(false);
      this.errorServidor.set('Error al procesar el registro del vehículo.');
    }
  }

  limpiar(): void {
    this.form.reset({
      placa: '',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      tipoMotor: 'Gasolina',
      clienteId: null,
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.errorServidor.set('');
  }
}
