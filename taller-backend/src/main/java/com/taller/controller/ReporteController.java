package com.taller.controller;

import com.taller.entity.EstadoOrden;
import com.taller.entity.OrdenMantenimiento;
import com.taller.entity.Servicio;
import com.taller.service.ClienteService;
import com.taller.service.OrdenService;
import com.taller.service.UsuarioService;
import com.taller.service.VehiculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ReporteController {

    private final ClienteService clienteService;
    private final VehiculoService vehiculoService;
    private final OrdenService ordenService;
    private final UsuarioService usuarioService;

    @GetMapping("/reportes")
    public String reportes(Model model) {
        List<OrdenMantenimiento> ordenes = ordenService.listarTodos();

        long serviciosMes = ordenes.stream()
                .filter(o -> o.getFechaIngreso() != null && o.getFechaIngreso().getMonth() == LocalDateTime.now().getMonth())
                .count();

        long clientesNuevos = clienteService.listarTodos().size();

        long ordenesPendientes = ordenes.stream()
                .filter(o -> o.getEstado() == EstadoOrden.PENDIENTE)
                .count();

        BigDecimal totalIngresos = ordenes.stream()
                .filter(o -> o.getEstado() == EstadoOrden.TERMINADO)
                .flatMap(o -> o.getServicios().stream())
                .map(Servicio::getPrecioBase)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        model.addAttribute("serviciosMes", serviciosMes);
        model.addAttribute("clientesNuevos", clientesNuevos);
        model.addAttribute("ordenesPendientes", ordenesPendientes);
        model.addAttribute("totalIngresos", totalIngresos);

        return "reportes/index";
    }
}