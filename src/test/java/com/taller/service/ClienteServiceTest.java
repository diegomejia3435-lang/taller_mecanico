package com.taller.service;

import com.taller.entity.Cliente;
import com.taller.repository.ClienteRepository;
import com.taller.service.impl.ClienteServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteServiceImpl clienteService;

    private Cliente clientePrueba;

    @BeforeEach
    void setUp() {
        clientePrueba = new Cliente();
        clientePrueba.setId(1L);
        clientePrueba.setNombreCompleto("Maria Lopez");
        clientePrueba.setDni("88888888");
        clientePrueba.setTelefono("911223344");
        clientePrueba.setCorreo("maria@gmail.com");
    }

    @Test
    @DisplayName("Service Test 1: Guardar cliente exitosamente")
    void guardarCliente_exito() {
        when(clienteRepository.save(any(Cliente.class))).thenReturn(clientePrueba);

        Cliente resultado = clienteService.guardar(clientePrueba);

        assertNotNull(resultado);
        assertEquals("Maria Lopez", resultado.getNombreCompleto());
        assertEquals("88888888", resultado.getDni());
        verify(clienteRepository, times(1)).save(clientePrueba);
    }

    @Test
    @DisplayName("Service Test 2: Buscar cliente por ID existente")
    void buscarPorId_cuandoExiste_retornaCliente() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(clientePrueba));

        Cliente resultado = clienteService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Maria Lopez", resultado.getNombreCompleto());
        verify(clienteRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Service Test 3: Buscar cliente por ID inexistente")
    void buscarPorId_cuandoNoExiste_retornaNull() {
        when(clienteRepository.findById(999L)).thenReturn(Optional.empty());

        Cliente resultado = clienteService.buscarPorId(999L);

        assertNull(resultado);
        verify(clienteRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Service Test 4: Listar todos los clientes")
    void listarTodos_retornaListaClientes() {
        when(clienteRepository.findAll()).thenReturn(Arrays.asList(clientePrueba));

        List<Cliente> clientes = clienteService.listarTodos();

        assertNotNull(clientes);
        assertEquals(1, clientes.size());
        verify(clienteRepository, times(1)).findAll();
    }
}
