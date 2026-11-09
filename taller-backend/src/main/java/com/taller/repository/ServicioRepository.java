package com.taller.repository;

import com.taller.entity.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicioRepository
        extends JpaRepository<Servicio, Long> {
}