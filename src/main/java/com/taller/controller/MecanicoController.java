package com.taller.controller;

import com.taller.entity.Usuario;
import com.taller.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class MecanicoController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping("/mecanicos")
    public String listar(Model model) {
        List<Usuario> mecanicos = usuarioRepository.findByRolNombre("ROLE_MECANICO");

        long totalMecanicos = mecanicos.size();
        long activos = mecanicos.stream()
                .filter(m -> "Activo".equalsIgnoreCase(m.getEstado()))
                .count();
        long enDescanso = mecanicos.stream()
                .filter(m -> "En Descanso".equalsIgnoreCase(m.getEstado()))
                .count();

        model.addAttribute("mecanicos", mecanicos);
        model.addAttribute("totalMecanicos", totalMecanicos);
        model.addAttribute("activos", activos);
        model.addAttribute("enDescanso", enDescanso);

        return "mecanicos/lista";
    }
}