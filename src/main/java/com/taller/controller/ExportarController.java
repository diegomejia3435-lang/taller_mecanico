package com.taller.controller;

import com.taller.entity.*;
import com.taller.repository.*;
import com.taller.reports.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.io.IOException;
import java.io.PrintWriter;

@Controller
@RequiredArgsConstructor
public class ExportarController {

    private final ClienteRepository clienteRepository;
    private final VehiculoRepository vehiculoRepository;
    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/exportar")
    public String exportar(Model model) {
        model.addAttribute("totalClientes", clienteRepository.count());
        model.addAttribute("totalVehiculos", vehiculoRepository.count());
        model.addAttribute("totalOrdenes", ordenRepository.count());
        model.addAttribute("totalUsuarios", usuarioRepository.count());
        return "exportar/lista";
    }

    @GetMapping("/exportar/clientes/csv")
    public void exportarClientes(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"clientes.csv\"");
        PrintWriter writer = response.getWriter();
        writer.write("\uFEFF");
        writer.println("ID,Nombre Completo,DNI,Telefono,Correo");
        for (Cliente c : clienteRepository.findAll()) {
            writer.println(c.getId() + "," + escapeCsv(c.getNombreCompleto()) + "," + escapeCsv(c.getDni()) + "," + escapeCsv(c.getTelefono()) + "," + escapeCsv(c.getCorreo()));
        }
        writer.flush();
    }

    @GetMapping("/exportar/vehiculos/csv")
    public void exportarVehiculos(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"vehiculos.csv\"");
        PrintWriter writer = response.getWriter();
        writer.write("\uFEFF");
        writer.println("ID,Placa,Marca,Modelo,Anio,Tipo Motor,Cliente");
        for (Vehiculo v : vehiculoRepository.findAll()) {
            String clienteName = v.getCliente() != null ? v.getCliente().getNombreCompleto() : "";
            writer.println(v.getId() + "," + escapeCsv(v.getPlaca()) + "," + escapeCsv(v.getMarca()) + "," + escapeCsv(v.getModelo()) + "," + v.getAnio() + "," + escapeCsv(v.getTipoMotor()) + "," + escapeCsv(clienteName));
        }
        writer.flush();
    }

    @GetMapping("/exportar/ordenes/csv")
    public void exportarOrdenes(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"ordenes.csv\"");
        PrintWriter writer = response.getWriter();
        writer.write("\uFEFF");
        writer.println("ID,Cliente,Vehiculo Placa,Mecanico,Fecha Ingreso,Fecha Salida,Estado,Diagnostico");
        for (OrdenMantenimiento o : ordenRepository.findAll()) {
            String clienteName = o.getVehiculo() != null && o.getVehiculo().getCliente() != null ? o.getVehiculo().getCliente().getNombreCompleto() : "";
            String placa = o.getVehiculo() != null ? o.getVehiculo().getPlaca() : "";
            String mecanicoName = o.getMecanico() != null ? o.getMecanico().getNombreCompleto() : "";
            writer.println(o.getId() + "," + escapeCsv(clienteName) + "," + escapeCsv(placa) + "," + escapeCsv(mecanicoName) + "," + o.getFechaIngreso() + "," + o.getFechaSalida() + "," + o.getEstado() + "," + escapeCsv(o.getDiagnosticoTecnico()));
        }
        writer.flush();
    }

    @GetMapping("/exportar/historial/csv")
    public void exportarHistorial(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"historial.csv\"");
        PrintWriter writer = response.getWriter();
        writer.write("\uFEFF");
        writer.println("ID,Fecha,Vehiculo Placa,Cliente,Mecanico,Estado");
        for (OrdenMantenimiento o : ordenRepository.findAll()) {
            String clienteName = o.getVehiculo() != null && o.getVehiculo().getCliente() != null ? o.getVehiculo().getCliente().getNombreCompleto() : "";
            String placa = o.getVehiculo() != null ? o.getVehiculo().getPlaca() : "";
            String mecanicoName = o.getMecanico() != null ? o.getMecanico().getNombreCompleto() : "";
            writer.println(o.getId() + "," + o.getFechaIngreso() + "," + escapeCsv(placa) + "," + escapeCsv(clienteName) + "," + escapeCsv(mecanicoName) + "," + o.getEstado());
        }
        writer.flush();
    }

    @GetMapping("/exportar/clientes/pdf")
    public void exportarClientesPDF(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"clientes.pdf\"");
        ClienteExporterPDF exporter = new ClienteExporterPDF(clienteRepository.findAll());
        exporter.export(response);
    }

    @GetMapping("/exportar/clientes/excel")
    public void exportarClientesExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\"clientes.xlsx\"");
        ClienteExporterExcel exporter = new ClienteExporterExcel(clienteRepository.findAll());
        exporter.export(response);
    }

    @GetMapping("/exportar/vehiculos/pdf")
    public void exportarVehiculosPDF(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"vehiculos.pdf\"");
        VehiculoExporterPDF exporter = new VehiculoExporterPDF(vehiculoRepository.findAll());
        exporter.export(response);
    }

    @GetMapping("/exportar/vehiculos/excel")
    public void exportarVehiculosExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\"vehiculos.xlsx\"");
        VehiculoExporterExcel exporter = new VehiculoExporterExcel(vehiculoRepository.findAll());
        exporter.export(response);
    }

    @GetMapping("/exportar/ordenes/pdf")
    public void exportarOrdenesPDF(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"ordenes.pdf\"");
        OrdenExporterPDF exporter = new OrdenExporterPDF(ordenRepository.findAll());
        exporter.export(response);
    }

    @GetMapping("/exportar/ordenes/excel")
    public void exportarOrdenesExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\"ordenes.xlsx\"");
        OrdenExporterExcel exporter = new OrdenExporterExcel(ordenRepository.findAll());
        exporter.export(response);
    }

    @GetMapping("/exportar/historial/pdf")
    public void exportarHistorialPDF(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"historial.pdf\"");
        HistorialExporterPDF exporter = new HistorialExporterPDF(ordenRepository.findAll());
        exporter.export(response);
    }

    @GetMapping("/exportar/historial/excel")
    public void exportarHistorialExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\"historial.xlsx\"");
        HistorialExporterExcel exporter = new HistorialExporterExcel(ordenRepository.findAll());
        exporter.export(response);
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }
}