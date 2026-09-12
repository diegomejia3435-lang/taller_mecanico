package com.taller.controller;

import com.taller.entity.EstadoOrden;
import com.taller.entity.OrdenMantenimiento;
import com.taller.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final ClienteRepository clienteRepository;
    private final VehiculoRepository vehiculoRepository;
    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/")
    public String inicio(Model model, Authentication auth) {

        boolean esMecanico = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MECANICO"));

        boolean esCliente = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CLIENTE"));

        if (esMecanico) {
            List<OrdenMantenimiento> ordenes = ordenRepository.findByMecanicoUsername(auth.getName());
            long totalClientes = ordenes.stream().map(o -> o.getVehiculo().getCliente()).distinct().count();
            long totalVehiculos = ordenes.stream().map(o -> o.getVehiculo()).distinct().count();
            long totalOrdenes = ordenes.size();
            long pending = ordenes.stream().filter(o -> o.getEstado() == EstadoOrden.PENDIENTE).count();
            long finished = ordenes.stream().filter(o -> o.getEstado() == EstadoOrden.TERMINADO).count();

            model.addAttribute("totalClientes", totalClientes);
            model.addAttribute("totalVehiculos", totalVehiculos);
            model.addAttribute("totalOrdenes", totalOrdenes);
            model.addAttribute("ordenesPendientes", pending);
            model.addAttribute("ordenesTerminadas", finished);
            model.addAttribute("totalUsuarios", usuarioRepository.count());

        } else if (esCliente) {
            List<OrdenMantenimiento> ordenes = ordenRepository.findByVehiculo_Cliente_Dni(auth.getName());
            long totalClientes = 1;
            long totalVehiculos = ordenes.stream().map(o -> o.getVehiculo()).distinct().count();
            long totalOrdenes = ordenes.size();
            long pending = ordenes.stream().filter(o -> o.getEstado() == EstadoOrden.PENDIENTE).count();
            long finished = ordenes.stream().filter(o -> o.getEstado() == EstadoOrden.TERMINADO).count();

            model.addAttribute("totalClientes", totalClientes);
            model.addAttribute("totalVehiculos", totalVehiculos);
            model.addAttribute("totalOrdenes", totalOrdenes);
            model.addAttribute("ordenesPendientes", pending);
            model.addAttribute("ordenesTerminadas", finished);
            model.addAttribute("totalUsuarios", 0);

        } else {
            model.addAttribute("totalClientes", clienteRepository.count());
            model.addAttribute("totalVehiculos", vehiculoRepository.count());
            model.addAttribute("totalOrdenes", ordenRepository.count());
            model.addAttribute("ordenesPendientes", ordenRepository.countByEstado(EstadoOrden.PENDIENTE));
            model.addAttribute("ordenesTerminadas", ordenRepository.countByEstado(EstadoOrden.TERMINADO));
            model.addAttribute("totalUsuarios", usuarioRepository.count());
        }

        return "index";
    }

    @GetMapping("/debug-roles")
    @ResponseBody
    public String debugRoles(Authentication auth) {
        if (auth == null) {
            return "No authenticated user session found.";
        }
        return "Username: " + auth.getName() + " | Authorities: " + auth.getAuthorities();
    }
}