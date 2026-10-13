package com.taller.service.impl;

import com.taller.entity.Cliente;
import com.taller.repository.ClienteRepository;
import com.taller.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @Override
    @Transactional
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    @Transactional(readOnly = true)
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorNombreODni(String query) {
        return clienteRepository.findByNombreCompletoContainingIgnoreCaseOrDniContaining(query, query);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorNombreContiene(String texto) {
        return clienteRepository.buscarPorNombreContiene(texto);
    }
}