import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrdenService } from '../../services/orden.service';
import { VehiculoService } from '../../services/vehiculo.service';
import { EstadoOrden } from '../../models/orden.model';

@Component({
  selector: 'app-ordenes-form-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './ordenes-form.page.html',
  styleUrl: './ordenes-form.page.scss',
})
export class OrdenesFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private ordenService = inject(OrdenService);
  readonly vehiculoService = inject(VehiculoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ordenId: number | null = null;
  esEdicion = false;

  form: FormGroup = this.fb.group({
    vehiculoId: [null, [Validators.required]],
    diagnosticoTecnico: ['', [Validators.required, Validators.minLength(5)]],
    montoTotal: [100.0, [Validators.required, Validators.min(0)]],
    estado: ['PENDIENTE', [Validators.required]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.ordenId = Number(idParam);
      const orden = this.ordenService.buscarPorId(this.ordenId);
      if (orden) {
        this.esEdicion = true;
        this.form.patchValue({
          vehiculoId: orden.vehiculo.id,
          diagnosticoTecnico: orden.diagnosticoTecnico || '',
          montoTotal: orden.montoTotal || 0,
          estado: orden.estado,
        });
      } else {
        this.router.navigate(['/ordenes']);
      }
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { vehiculoId, diagnosticoTecnico, montoTotal, estado } = this.form.value;
    const vehiculoSeleccionado = this.vehiculoService.buscarPorId(Number(vehiculoId));

    if (!vehiculoSeleccionado) return;

    const datos = {
      id: this.ordenId ?? undefined,
      vehiculo: vehiculoSeleccionado,
      mecanico: {
        id: 2,
        username: 'carlos',
        nombreCompleto: 'Carlos Mendoza',
        especialidad: 'Motor y Frenos',
      },
      diagnosticoTecnico,
      montoTotal: Number(montoTotal),
      estado: estado as EstadoOrden,
    };

    this.ordenService.guardar(datos);
    this.router.navigate(['/ordenes']);
  }
}
