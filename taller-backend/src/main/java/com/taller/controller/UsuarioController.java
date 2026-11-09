package com.taller.controller;

import com.taller.entity.Usuario;
import com.taller.repository.RolRepository;
import com.taller.service.UsuarioService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    private final RolRepository rolRepository;

    @GetMapping
    public String listar(Model model) {

        model.addAttribute(
                "usuarios",
                usuarioService.listarTodos()
        );

        return "usuarios/lista";

    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {

        model.addAttribute(
                "usuario",
                new Usuario()
        );

        model.addAttribute(
                "roles",
                rolRepository.findAll()
        );

        return "usuarios/form";

    }

    @PostMapping("/guardar")
    public String guardar(
            @ModelAttribute Usuario usuario
    ) {

        usuarioService.guardar(usuario);

        return "redirect:/usuarios";

    }

    @GetMapping("/editar/{id}")
    public String editar(
            @PathVariable Long id,
            Model model
    ) {

        model.addAttribute(
                "usuario",
                usuarioService.buscarPorId(id)
        );

        model.addAttribute(
                "roles",
                rolRepository.findAll()
        );

        return "usuarios/form";

    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(
            @PathVariable Long id
    ) {

        Usuario usuario = usuarioService.buscarPorId(id);

        if (usuario != null &&
                usuario.getUsername().equals("admin")) {

            return "redirect:/usuarios";

        }

        usuarioService.eliminar(id);

        return "redirect:/usuarios";

    }

}