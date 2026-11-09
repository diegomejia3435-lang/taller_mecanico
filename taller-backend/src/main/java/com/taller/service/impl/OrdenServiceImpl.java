package com.taller.service.impl;

import com.taller.entity.OrdenMantenimiento;
import com.taller.entity.Usuario;
import com.taller.exception.ResourceNotFoundException;
import com.taller.repository.OrdenRepository;
import com.taller.repository.UsuarioRepository;
import com.taller.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdenServiceImpl implements OrdenService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrdenMantenimiento> listarTodos() {
        return ordenRepository.findAll();
    }

    @Override
    @Transactional
    public OrdenMantenimiento guardar(OrdenMantenimiento orden) {
        if (orden.getId() != null) {
            OrdenMantenimiento ordenBD = ordenRepository.findById(orden.getId()).orElse(null);
            if (ordenBD != null) {
                org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                boolean esMecanico = auth != null && auth.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_MECANICO"));
                if (esMecanico) {
                    ordenBD.setEstado(orden.getEstado());
                    ordenBD.setDiagnosticoTecnico(orden.getDiagnosticoTecnico());
                    if (orden.getEstado() == com.taller.entity.EstadoOrden.TERMINADO) {
                        ordenBD.setFechaSalida(java.time.LocalDateTime.now());
                    } else {
                        ordenBD.setFechaSalida(null);
                    }
                    return ordenRepository.save(ordenBD);
                }
            }
        }
        
        if (orden.getEstado() == com.taller.entity.EstadoOrden.TERMINADO) {
            orden.setFechaSalida(java.time.LocalDateTime.now());
        } else {
            orden.setFechaSalida(null);
        }
        return ordenRepository.save(orden);
    }

    @Override
    @Transactional(readOnly = true)
    public OrdenMantenimiento buscarPorId(Long id) {
        return ordenRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        ordenRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenMantenimiento> listarPorMecanico(String username) {
        return ordenRepository.findByMecanicoUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenMantenimiento> buscarOrdenes(String query) {
        return ordenRepository.findByVehiculo_PlacaContainingIgnoreCaseOrVehiculo_Cliente_NombreCompletoContainingIgnoreCase(query, query);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenMantenimiento> buscarOrdenesPorMecanico(String query, String username) {
        return ordenRepository.findByVehiculo_PlacaContainingIgnoreCaseOrVehiculo_Cliente_NombreCompletoContainingIgnoreCase(query, query).stream()
                .filter(o -> o.getMecanico() != null && o.getMecanico().getUsername().equals(username))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object[]> contarOrdenesPorEstado() {
        return ordenRepository.contarOrdenesPorEstado();
    }

    @Override
    @Transactional
    public OrdenMantenimiento reasignarMecanicoAtomiico(Long ordenId, Long nuevoMecanicoId) {
        OrdenMantenimiento orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden con ID " + ordenId + " no encontrada"));

        Usuario nuevoMecanico = usuarioRepository.findById(nuevoMecanicoId)
                .orElseThrow(() -> new ResourceNotFoundException("Nuevo mecánico con ID " + nuevoMecanicoId + " no encontrado"));

        orden.setMecanico(nuevoMecanico);
        return ordenRepository.save(orden);
    }
}