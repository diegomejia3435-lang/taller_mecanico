import { Component, OnInit, inject } from '@angular/core';
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

  form: FormGroup = this.fb.group({
    placa: [
      '',
      [
        Validators.required,
        Validators.pattern('^[A-Z0-9]{3}-[A-Z0-9]{3}$'),
      ],
    ],
    marca: ['', [Validators.required, Validators.minLength(2)]],
    modelo: ['', [Validators.required]],
    anio: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(1980), Validators.max(2027)],
    ],
    tipoMotor: ['Gasolina'],
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

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { placa, marca, modelo, anio, tipoMotor, clienteId } = this.form.value;
    const clienteSeleccionado = this.clienteService.buscarPorId(Number(clienteId));

    const datos = {
      id: this.vehiculoId ?? undefined,
      placa: (placa as string).toUpperCase(),
      marca,
      modelo,
      anio: Number(anio),
      tipoMotor,
      cliente: clienteSeleccionado,
    };

    this.vehiculoService.guardar(datos);
    this.router.navigate(['/vehiculos']);
  }
}
