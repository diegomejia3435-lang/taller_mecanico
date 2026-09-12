package com.taller.service;

import com.taller.entity.Vehiculo;

import java.util.List;

public interface VehiculoService {

    List<Vehiculo> listarTodos();

    Vehiculo guardar(Vehiculo vehiculo);

    Vehiculo buscarPorId(Long id);

    void eliminar(Long id);

    List<Vehiculo> buscarVehiculos(String query);
}