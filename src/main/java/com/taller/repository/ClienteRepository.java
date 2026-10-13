package com.taller.repository;

import com.taller.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    long count();
    List<Cliente> findByNombreCompletoContainingIgnoreCaseOrDniContaining(String nombre, String dni);

    @Query("select c from Cliente c where lower(c.nombreCompleto) like lower(concat('%', :texto, '%')) or lower(c.dni) like lower(concat('%', :texto, '%'))")
    List<Cliente> buscarPorNombreContiene(@Param("texto") String texto);
}