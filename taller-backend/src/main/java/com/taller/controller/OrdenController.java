package com.taller.controller;

import com.taller.entity.EstadoOrden;
import com.taller.entity.OrdenMantenimiento;
import com.taller.service.OrdenService;
import com.taller.service.VehiculoService;
import com.taller.repository.ServicioRepository;
import com.taller.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@Controller
@RequestMapping("/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService ordenService;

    private final VehiculoService vehiculoService;

    private final UsuarioRepository usuarioRepository;

    private final ServicioRepository servicioRepository;

    @GetMapping
    public String listar(
            @RequestParam(required = false) String buscar,
            Model model,
            Authentication auth
    ) {

        boolean esMecanico = auth
                .getAuthorities()
                .stream()
                .anyMatch(a ->
                        a.getAuthority()
                                .equals("ROLE_MECANICO")
                );

        if (esMecanico) {
            if (buscar != null && !buscar.isBlank()) {
                model.addAttribute(
                        "ordenes",
                        ordenService.buscarOrdenesPorMecanico(buscar, auth.getName())
                );
            } else {
                model.addAttribute(
                        "ordenes",
                        ordenService.listarPorMecanico(auth.getName())
                );
            }
        } else {
            if (buscar != null && !buscar.isBlank()) {
                model.addAttribute(
                        "ordenes",
                        ordenService.buscarOrdenes(buscar)
                );
            } else {
                model.addAttribute(
                        "ordenes",
                        ordenService.listarTodos()
                );
            }
        }

        model.addAttribute("buscar", buscar);
        return "ordenes/lista";

    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {

        model.addAttribute(
                "orden",
                new OrdenMantenimiento()
        );

        cargarDatosFormulario(model);

        return "ordenes/form";

    }

    @PostMapping("/guardar")
    public String guardar(
            @ModelAttribute OrdenMantenimiento orden
    ) {

        ordenService.guardar(orden);

        return "redirect:/ordenes";

    }

    @GetMapping("/editar/{id}")
    public String editar(
            @PathVariable Long id,
            Model model,
            Authentication auth
    ) {
        OrdenMantenimiento orden = ordenService.buscarPorId(id);

        boolean esMecanico = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MECANICO"));

        if (esMecanico && (orden == null || orden.getMecanico() == null || !orden.getMecanico().getUsername().equals(auth.getName()))) {
            return "redirect:/ordenes";
        }

        model.addAttribute("orden", orden);
        cargarDatosFormulario(model);

        return "ordenes/form";

    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {

        ordenService.eliminar(id);

        return "redirect:/ordenes";

    }

    private void cargarDatosFormulario(Model model) {

        model.addAttribute(
                "vehiculos",
                vehiculoService.listarTodos()
        );

        model.addAttribute(
                "mecanicos",
                usuarioRepository.findAll()
        );

        model.addAttribute(
                "servicios",
                servicioRepository.findAll()
        );

        model.addAttribute(
                "estados",
                EstadoOrden.values()
        );

    }

}