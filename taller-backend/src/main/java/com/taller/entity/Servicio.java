package com.taller.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "servicios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreServicio;

    private BigDecimal precioBase;

    @ManyToMany(mappedBy = "servicios")
    private List<OrdenMantenimiento> ordenes;
}