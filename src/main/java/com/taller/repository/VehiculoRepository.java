package com.taller.repository;

import com.taller.entity.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculoRepository
        extends JpaRepository<Vehiculo, Long> {
        long count();
        java.util.List<Vehiculo> findByPlacaContainingIgnoreCaseOrMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(String placa, String marca, String modelo);
}