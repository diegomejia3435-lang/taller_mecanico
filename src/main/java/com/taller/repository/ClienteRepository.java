package com.taller.repository;

import com.taller.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    long count();
    java.util.List<Cliente> findByNombreCompletoContainingIgnoreCaseOrDniContaining(String nombre, String dni);
}