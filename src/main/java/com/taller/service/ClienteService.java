package com.taller.service;

import com.taller.entity.Cliente;

import java.util.List;

public interface ClienteService {

    List<Cliente> listarTodos();

    Cliente guardar(Cliente cliente);

    Cliente buscarPorId(Long id);

    void eliminar(Long id);

    List<Cliente> buscarPorNombreODni(String query);
}