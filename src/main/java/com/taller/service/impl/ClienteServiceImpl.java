package com.taller.service.impl;

import com.taller.entity.Cliente;
import com.taller.repository.ClienteRepository;
import com.taller.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    @Override
    public List<Cliente> listarTodos() {

        return clienteRepository.findAll();

    }

    @Override
    public Cliente guardar(Cliente cliente) {

        return clienteRepository.save(cliente);

    }

    @Override
    public Cliente buscarPorId(Long id) {

        return clienteRepository.findById(id).orElse(null);

    }

    @Override
    public void eliminar(Long id) {

        clienteRepository.deleteById(id);

    }

    @Override
    public List<Cliente> buscarPorNombreODni(String query) {
        return clienteRepository.findByNombreCompletoContainingIgnoreCaseOrDniContaining(query, query);
    }

}