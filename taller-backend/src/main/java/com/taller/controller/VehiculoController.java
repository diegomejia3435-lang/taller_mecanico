package com.taller.controller;

import com.taller.entity.Vehiculo;
import com.taller.service.ClienteService;
import com.taller.service.VehiculoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/vehiculos")
@RequiredArgsConstructor
public class VehiculoController {

    private final VehiculoService vehiculoService;
    private final ClienteService clienteService;

    @GetMapping
    public String listar(
            @RequestParam(required = false) String buscar,
            Model model
    ) {

        if (buscar != null && !buscar.isBlank()) {
            model.addAttribute(
                    "vehiculos",
                    vehiculoService.buscarVehiculos(buscar)
            );
            model.addAttribute("buscar", buscar);
        } else {
            model.addAttribute(
                    "vehiculos",
                    vehiculoService.listarTodos()
            );
        }

        return "vehiculos/lista";

    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {

        model.addAttribute(
                "vehiculo",
                new Vehiculo()
        );

        model.addAttribute(
                "clientes",
                clienteService.listarTodos()
        );

        return "vehiculos/form";

    }

    @PostMapping("/guardar")
    public String guardar(
            @Valid @ModelAttribute Vehiculo vehiculo,
            BindingResult result,
            Model model
    ) {

        if (result.hasErrors()) {

            model.addAttribute(
                    "clientes",
                    clienteService.listarTodos()
            );

            return "vehiculos/form";

        }

        vehiculoService.guardar(vehiculo);

        return "redirect:/vehiculos";

    }

    @GetMapping("/editar/{id}")
    public String editar(
            @PathVariable Long id,
            Model model
    ) {

        model.addAttribute(
                "vehiculo",
                vehiculoService.buscarPorId(id)
        );

        model.addAttribute(
                "clientes",
                clienteService.listarTodos()
        );

        return "vehiculos/form";

    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {

        vehiculoService.eliminar(id);

        return "redirect:/vehiculos";

    }

}