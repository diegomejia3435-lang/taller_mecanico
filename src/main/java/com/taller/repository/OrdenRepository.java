package com.taller.repository;

import com.taller.entity.EstadoOrden;
import com.taller.entity.OrdenMantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenRepository
        extends JpaRepository<OrdenMantenimiento, Long> {
    List<OrdenMantenimiento> findByVehiculo_PlacaContainingIgnoreCase(String placa);
    List<OrdenMantenimiento> findByVehiculo_PlacaContainingIgnoreCaseOrVehiculo_Cliente_NombreCompletoContainingIgnoreCase(String placa, String clienteName);
    List<OrdenMantenimiento> findByMecanicoUsername(String username);
    List<OrdenMantenimiento> findByVehiculo_Cliente_Dni(String dni);
    long countByEstado(EstadoOrden estado);
}