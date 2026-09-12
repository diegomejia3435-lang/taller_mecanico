package com.taller.service;

import com.taller.entity.*;
import com.taller.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            UsuarioRepository usuarioRepo,
            RolRepository rolRepo,
            ClienteRepository clienteRepo,
            VehiculoRepository vehiculoRepo,
            ServicioRepository servicioRepo,
            OrdenRepository ordenRepo,
            PasswordEncoder encoder) {

        return args -> {

            // 1. Initialize Roles
            Rol adminRol = rolRepo.findByNombre("ROLE_ADMIN")
                    .orElseGet(() -> rolRepo.save(new Rol("ROLE_ADMIN")));

            Rol mecanicoRol = rolRepo.findByNombre("ROLE_MECANICO")
                    .orElseGet(() -> rolRepo.save(new Rol("ROLE_MECANICO")));

            Rol clienteRol = rolRepo.findByNombre("ROLE_CLIENTE")
                    .orElseGet(() -> rolRepo.save(new Rol("ROLE_CLIENTE")));

            // 2. Initialize Users (Admin)
            Usuario admin = usuarioRepo.findByUsername("admin").orElse(null);
            if (admin == null) {
                admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("1234"));
            }
            admin.setRol(adminRol);
            admin.setNombreCompleto("Administrador");
            admin.setTelefono("999000000");
            admin.setEstado("Activo");
            usuarioRepo.save(admin);

            // 3. Seed Mechanics (1)
            List<Usuario> listMecanicos = new ArrayList<>();
            Usuario carlos = usuarioRepo.findByUsername("carlos").orElse(null);
            if (carlos == null) {
                carlos = new Usuario();
                carlos.setUsername("carlos");
                carlos.setPassword(encoder.encode("1234"));
            }
            carlos.setRol(mecanicoRol);
            carlos.setNombreCompleto("Carlos Mendoza");
            carlos.setEspecialidad("Motor");
            carlos.setTelefono("999888777");
            carlos.setEstado("Activo");
            carlos = usuarioRepo.save(carlos);
            listMecanicos.add(carlos);

            // 4. Seed Services Catalog (1)
            List<Servicio> listServicios = new ArrayList<>();
            Servicio aceite = servicioRepo.findAll().stream()
                    .filter(x -> x.getNombreServicio().equalsIgnoreCase("Cambio de aceite"))
                    .findFirst().orElse(null);
            if (aceite == null) {
                aceite = new Servicio();
                aceite.setNombreServicio("Cambio de aceite");
                aceite.setPrecioBase(new BigDecimal("150.00"));
                aceite = servicioRepo.save(aceite);
            }
            listServicios.add(aceite);

            // 5. Seed Clients & Client Users & Vehicles (1)
            List<Vehiculo> listVehiculos = new ArrayList<>();
            
            // Client Entity
            Cliente juan = clienteRepo.findAll().stream()
                    .filter(x -> x.getDni().equals("77777777"))
                    .findFirst().orElse(null);
            if (juan == null) {
                juan = new Cliente();
                juan.setNombreCompleto("Juan Pérez");
                juan.setDni("77777777");
                juan.setTelefono("955555555");
                juan.setCorreo("juan@gmail.com");
                juan = clienteRepo.save(juan);
            }

            // Client Security User
            Usuario juanUser = usuarioRepo.findByUsername("77777777").orElse(null);
            if (juanUser == null) {
                juanUser = new Usuario();
                juanUser.setUsername("77777777");
                juanUser.setPassword(encoder.encode("1234"));
            }
            juanUser.setRol(clienteRol);
            juanUser.setNombreCompleto("Juan Pérez");
            juanUser.setTelefono("955555555");
            juanUser.setEstado("Activo");
            usuarioRepo.save(juanUser);

            // Vehicle
            Vehiculo corolla = vehiculoRepo.findAll().stream()
                    .filter(x -> x.getPlaca().equalsIgnoreCase("ABC-123"))
                    .findFirst().orElse(null);
            if (corolla == null) {
                corolla = new Vehiculo();
                corolla.setPlaca("ABC-123");
                corolla.setMarca("Toyota");
                corolla.setModelo("Corolla");
                corolla.setAnio(2020);
                corolla.setCliente(juan);
                corolla = vehiculoRepo.save(corolla);
            }
            listVehiculos.add(corolla);

            // 6. Seed Maintenance Orders (1)
            if (ordenRepo.findAll().isEmpty()) {
                createOrder(ordenRepo, listVehiculos.get(0), listMecanicos.get(0), EstadoOrden.PENDIENTE, "Revisión general y cambio de aceite.", List.of(listServicios.get(0)));
            }
        };
    }

    private void createOrder(OrdenRepository repo, Vehiculo v, Usuario m, EstadoOrden estado, String diag, List<Servicio> srvs) {
        OrdenMantenimiento o = new OrdenMantenimiento();
        o.setVehiculo(v);
        o.setMecanico(m);
        o.setEstado(estado);
        o.setFechaIngreso(LocalDateTime.now().minusDays(estado == EstadoOrden.TERMINADO ? 2 : 0));
        if (estado == EstadoOrden.TERMINADO) {
            o.setFechaSalida(LocalDateTime.now().minusDays(1));
        }
        o.setDiagnosticoTecnico(diag);
        o.setServicios(srvs);
        repo.save(o);
    }
}