package com.taller.controller.api;

import com.taller.entity.Vehiculo;
import com.taller.service.VehiculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
@RequiredArgsConstructor
public class VehiculoRestController {

    private final VehiculoService vehiculoService;

    @GetMapping
    public List<Vehiculo> listar() {
        return vehiculoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehiculo> obtener(@PathVariable Long id) {
        Vehiculo v = vehiculoService.buscarPorId(id);
        return v != null ? ResponseEntity.ok(v) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Vehiculo crear(@RequestBody Vehiculo vehiculo) {
        return vehiculoService.guardar(vehiculo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehiculo> actualizar(@PathVariable Long id, @RequestBody Vehiculo vehiculo) {
        Vehiculo v = vehiculoService.buscarPorId(id);
        if (v == null) {
            return ResponseEntity.notFound().build();
        }
        vehiculo.setId(id);
        return ResponseEntity.ok(vehiculoService.guardar(vehiculo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Vehiculo v = vehiculoService.buscarPorId(id);
        if (v == null) {
            return ResponseEntity.notFound().build();
        }
        vehiculoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
