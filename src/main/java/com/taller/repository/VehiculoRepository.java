package com.taller.repository;

import com.taller.entity.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    long count();
    List<Vehiculo> findByPlacaContainingIgnoreCaseOrMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(String placa, String marca, String modelo);

    @Query("select v from Vehiculo v where v.anio between :min and :max order by v.anio asc")
    List<Vehiculo> buscarPorAnioEnRango(@Param("min") Integer min, @Param("max") Integer max);
}