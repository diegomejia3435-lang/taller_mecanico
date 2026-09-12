package com.taller.controller;

import com.taller.entity.Cliente;
import com.taller.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public String listar(
            @RequestParam(required = false) String buscar,
            Model model
    ) {

        if (buscar != null && !buscar.isBlank()) {
            model.addAttribute(
                    "clientes",
                    clienteService.buscarPorNombreODni(buscar)
            );
            model.addAttribute("buscar", buscar);
        } else {
            model.addAttribute(
                    "clientes",
                    clienteService.listarTodos()
            );
        }

        return "clientes/lista";

    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {

        model.addAttribute(
                "cliente",
                new Cliente()
        );

        return "clientes/form";

    }

    @PostMapping("/guardar")
    public String guardar(
            @Valid @ModelAttribute Cliente cliente,
            BindingResult result
    ) {

        if (result.hasErrors()) {

            return "clientes/form";

        }

        clienteService.guardar(cliente);

        return "redirect:/clientes";

    }

    @GetMapping("/editar/{id}")
    public String editar(
            @PathVariable Long id,
            Model model
    ) {

        model.addAttribute(
                "cliente",
                clienteService.buscarPorId(id)
        );

        return "clientes/form";

    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {

        clienteService.eliminar(id);

        return "redirect:/clientes";

    }

}