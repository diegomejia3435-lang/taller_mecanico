package com.taller.repository;

import com.taller.entity.Cliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ClienteRepositoryTest {

    @Autowired
    private ClienteRepository clienteRepository;

    @Test
    @DisplayName("JPQL Test: buscarPorNombreContiene retorna resultados usando LIKE")
    void buscarPorNombreContiene_retornaResultados() {
        Cliente c = new Cliente();
        c.setNombreCompleto("Roberto Gomez");
        c.setDni("11223344");
        c.setTelefono("999111222");
        c.setCorreo("roberto@gmail.com");
        clienteRepository.save(c);

        List<Cliente> resultados = clienteRepository.buscarPorNombreContiene("roberto");

        assertNotNull(resultados);
        assertFalse(resultados.isEmpty());
    }
}
