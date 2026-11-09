package com.taller.controller.api;

import com.taller.entity.OrdenMantenimiento;
import com.taller.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenRestController {

    private final OrdenService ordenService;

    @GetMapping
    public List<OrdenMantenimiento> listar() {
        return ordenService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenMantenimiento> obtener(@PathVariable Long id) {
        OrdenMantenimiento o = ordenService.buscarPorId(id);
        return o != null ? ResponseEntity.ok(o) : ResponseEntity.notFound().build();
    }

    @GetMapping("/estadisticas/por-estado")
    public List<Map<String, Object>> contarPorEstado() {
        List<Object[]> resultados = ordenService.contarOrdenesPorEstado();
        return resultados.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("estado", r[0]);
            map.put("cantidad", r[1]);
            return map;
        }).toList();
    }

    @PostMapping("/transacciones/reemplazar-mecanico")
    public ResponseEntity<OrdenMantenimiento> reemplazarMecanico(
            @RequestParam Long ordenId,
            @RequestParam Long nuevoMecanicoId) {
        OrdenMantenimiento actualizada = ordenService.reasignarMecanicoAtomiico(ordenId, nuevoMecanicoId);
        return ResponseEntity.ok(actualizada);
    }
}
