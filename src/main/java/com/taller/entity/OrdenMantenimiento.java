package com.taller.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "ordenes_mantenimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrdenMantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehiculo_id")
    private Vehiculo vehiculo;

    @ManyToOne
    @JoinColumn(name = "mecanico_id")
    private Usuario mecanico;

    private LocalDateTime fechaIngreso =
            LocalDateTime.now();

    private LocalDateTime fechaSalida;

    @Enumerated(EnumType.STRING)
    private EstadoOrden estado =
            EstadoOrden.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String diagnosticoTecnico;

    @ManyToMany
    @JoinTable(
            name = "orden_servicios",
            joinColumns = @JoinColumn(name = "orden_id"),
            inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    private List<Servicio> servicios;

    @PrePersist
    @PreUpdate
    public void validarConsistenciaFechas() {
        if (fechaSalida != null && fechaIngreso != null) {
            if (fechaSalida.isBefore(fechaIngreso)) {
                throw new IllegalStateException("Consistencia de Datos: La fecha de salida no puede ser anterior a la fecha de ingreso.");
            }
        }
    }
    
}