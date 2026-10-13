package com.taller.service.impl;

import com.taller.entity.Vehiculo;
import com.taller.repository.VehiculoRepository;
import com.taller.service.VehiculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehiculoServiceImpl implements VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Vehiculo> listarTodos() {
        return vehiculoRepository.findAll();
    }

    @Override
    @Transactional
    public Vehiculo guardar(Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }

    @Override
    @Transactional(readOnly = true)
    public Vehiculo buscarPorId(Long id) {
        return vehiculoRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        vehiculoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vehiculo> buscarVehiculos(String query) {
        return vehiculoRepository.findByPlacaContainingIgnoreCaseOrMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(query, query, query);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vehiculo> buscarPorAnioEnRango(Integer min, Integer max) {
        return vehiculoRepository.buscarPorAnioEnRango(min, max);
    }
}