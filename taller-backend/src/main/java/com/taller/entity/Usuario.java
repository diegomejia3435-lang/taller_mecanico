package com.taller.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private Boolean enabled = true;

    private String nombreCompleto;

    private String especialidad;

    private String telefono;

    private String estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "mecanico")
    private List<OrdenMantenimiento> ordenes;
}