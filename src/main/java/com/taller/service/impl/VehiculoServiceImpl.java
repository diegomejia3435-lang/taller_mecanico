package com.taller.service.impl;

import com.taller.entity.Vehiculo;
import com.taller.repository.VehiculoRepository;
import com.taller.service.VehiculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehiculoServiceImpl
        implements VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    @Override
    public List<Vehiculo> listarTodos() {

        return vehiculoRepository.findAll();

    }

    @Override
    public Vehiculo guardar(Vehiculo vehiculo) {

        return vehiculoRepository.save(vehiculo);

    }

    @Override
    public Vehiculo buscarPorId(Long id) {

        return vehiculoRepository.findById(id)
                .orElse(null);

    }

    @Override
    public void eliminar(Long id) {

        vehiculoRepository.deleteById(id);

    }

    @Override
    public List<Vehiculo> buscarVehiculos(String query) {
        return vehiculoRepository.findByPlacaContainingIgnoreCaseOrMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(query, query, query);
    }

}