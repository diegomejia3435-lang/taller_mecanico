package com.taller.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "vehiculos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La placa es obligatoria")
    @Pattern(regexp = "^[A-Z0-9]{3}-[A-Z0-9]{3}$", message = "La placa debe tener el formato estándar (Ej. ABC-123 o A1B-234)")
    @Column(unique = true, nullable = false)
    private String placa;

    @NotBlank
    private String marca;

    private String modelo;

    private Integer anio;

    private String tipoMotor;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "vehiculo")
    private List<OrdenMantenimiento> ordenes;
}