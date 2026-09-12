package com.taller.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombreCompleto;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^\\d{8}$", message = "El DNI debe constar de exactamente 8 dígitos numéricos")
    @Column(unique = true, nullable = false)
    private String dni;

    private String telefono;

    @Email
    private String correo;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "cliente")
    private List<Vehiculo> vehiculos;
}