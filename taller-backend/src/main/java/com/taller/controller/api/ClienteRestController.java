package com.taller.controller.api;

import com.taller.entity.Cliente;
import com.taller.exception.ResourceNotFoundException;
import com.taller.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteRestController {

    private final ClienteService clienteService;

    @GetMapping
    public List<Cliente> listar() {
        return clienteService.listarTodos();
    }

    @GetMapping("/buscar")
    public List<Cliente> buscar(@RequestParam String texto) {
        return clienteService.buscarPorNombreContiene(texto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtener(@PathVariable Long id) {
        Cliente c = clienteService.buscarPorId(id);
        if (c == null) {
            throw new ResourceNotFoundException("Cliente con ID " + id + " no encontrado");
        }
        return ResponseEntity.ok(c);
    }

    @PostMapping
    public ResponseEntity<Cliente> crear(@Valid @RequestBody Cliente cliente) {
        Cliente guardado = clienteService.guardar(cliente);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(guardado.getId())
                .toUri();
        return ResponseEntity.created(location).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @Valid @RequestBody Cliente cliente) {
        Cliente existente = clienteService.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("Cliente con ID " + id + " no encontrado");
        }
        cliente.setId(id);
        Cliente actualizado = clienteService.guardar(cliente);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Cliente> actualizarParcial(@PathVariable Long id, @RequestBody Map<String, Object> campos) {
        Cliente existente = clienteService.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("Cliente con ID " + id + " no encontrado");
        }
        if (campos.containsKey("telefono")) {
            existente.setTelefono((String) campos.get("telefono"));
        }
        if (campos.containsKey("correo")) {
            existente.setCorreo((String) campos.get("correo"));
        }
        if (campos.containsKey("nombreCompleto")) {
            existente.setNombreCompleto((String) campos.get("nombreCompleto"));
        }
        Cliente actualizado = clienteService.guardar(existente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Cliente existente = clienteService.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("Cliente con ID " + id + " no encontrado");
        }
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
