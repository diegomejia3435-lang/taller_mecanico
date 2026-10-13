package com.taller.service;

import com.taller.entity.OrdenMantenimiento;
import com.taller.entity.Usuario;
import com.taller.exception.ResourceNotFoundException;
import com.taller.repository.OrdenRepository;
import com.taller.repository.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrdenServiceTransactionTest {

    @Autowired
    private OrdenService ordenService;

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    @DisplayName("Transaction Test: reasignarMecanicoAtomiico cuando nuevo id no existe lanza excepcion y realiza Rollback")
    void reasignarMecanicoAtomiico_cuandoNuevoNoExiste_haceRollback() {
        // Arrange: Obtener primera orden existente
        OrdenMantenimiento ordenOriginal = ordenRepository.findAll().stream().findFirst().orElse(null);
        if (ordenOriginal == null) {
            return;
        }

        Long ordenId = ordenOriginal.getId();
        Usuario mecanicoOriginal = ordenOriginal.getMecanico();

        // Act & Assert: Intentar reasignar a un mecánico inexistente (999999L)
        assertThrows(ResourceNotFoundException.class, () -> {
            ordenService.reasignarMecanicoAtomiico(ordenId, 999999L);
        });

        // Verify: La orden conserva su mecánico original gracias al Rollback automático
        OrdenMantenimiento ordenVerificada = ordenRepository.findById(ordenId).orElseThrow();
        assertEquals(mecanicoOriginal != null ? mecanicoOriginal.getId() : null,
                ordenVerificada.getMecanico() != null ? ordenVerificada.getMecanico().getId() : null);
    }
}
