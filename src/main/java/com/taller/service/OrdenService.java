package com.taller.service;

import com.taller.entity.OrdenMantenimiento;

import java.util.List;

public interface OrdenService {

    List<OrdenMantenimiento> listarTodos();

    OrdenMantenimiento guardar(
            OrdenMantenimiento orden
    );

    OrdenMantenimiento buscarPorId(Long id);

    void eliminar(Long id);

    List<OrdenMantenimiento>
    listarPorMecanico(String username);

    List<OrdenMantenimiento> buscarOrdenes(String query);

    List<OrdenMantenimiento> buscarOrdenesPorMecanico(String query, String username);
}