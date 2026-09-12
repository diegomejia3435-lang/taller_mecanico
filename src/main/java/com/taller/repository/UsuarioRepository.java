package com.taller.repository;

import com.taller.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);
    java.util.List<Usuario> findByRolNombre(String nombreRol);
    long count();
}