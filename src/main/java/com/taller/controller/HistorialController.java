package com.taller.controller;

import com.taller.entity.OrdenMantenimiento;
import com.taller.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;

import java.util.List;

@Controller
public class HistorialController {

    @Autowired
    private OrdenRepository ordenRepository;

    @GetMapping("/historial")
    public String historial(
            @RequestParam(required = false) String placa,
            Model model,
            Authentication auth
    ) {

        List<OrdenMantenimiento> ordenes;

        boolean esCliente = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CLIENTE"));

        if (esCliente) {
            ordenes = ordenRepository.findByVehiculo_Cliente_Dni(auth.getName());
        } else if (placa != null && !placa.isEmpty()) {
            ordenes = ordenRepository.findByVehiculo_PlacaContainingIgnoreCase(placa);
        } else {
            ordenes = List.of();
        }

        model.addAttribute("ordenes", ordenes);
        model.addAttribute("placa", placa);
        model.addAttribute("esCliente", esCliente);

        return "historial/lista";
    }
}