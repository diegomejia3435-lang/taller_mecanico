import { Component, OnInit, inject, signal } from '@angular/core';
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
  readonly enviando = signal(false);
  readonly errorServidor = signal('');

  // Formulario reactivo con validaciones rigurosas (Semana 13 - UTP)
  readonly form: FormGroup = this.fb.group({
    vehiculoId: [null, [Validators.required]],
    diagnosticoTecnico: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/.*\S.*/)]],
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

    const { vehiculoId, diagnosticoTecnico, montoTotal, estado } = this.form.value;
    const vehiculoSeleccionado = this.vehiculoService.buscarPorId(Number(vehiculoId));

    if (!vehiculoSeleccionado) {
      this.enviando.set(false);
      this.errorServidor.set('El vehículo seleccionado no existe en el catálogo.');
      return;
    }

    const datos = {
      id: this.ordenId ?? undefined,
      vehiculo: vehiculoSeleccionado,
      mecanico: {
        id: 2,
        username: 'carlos',
        nombreCompleto: 'Carlos Mendoza',
        especialidad: 'Motor y Frenos',
      },
      diagnosticoTecnico: (diagnosticoTecnico as string).trim(),
      montoTotal: Number(montoTotal),
      estado: estado as EstadoOrden,
    };

    try {
      this.ordenService.guardar(datos);
      this.enviando.set(false);
      this.router.navigate(['/ordenes']);
    } catch {
      this.enviando.set(false);
      this.errorServidor.set('Error al procesar la orden de trabajo.');
    }
  }

  limpiar(): void {
    this.form.reset({
      vehiculoId: null,
      diagnosticoTecnico: '',
      montoTotal: 0,
      estado: 'PENDIENTE',
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.errorServidor.set('');
  }
}
