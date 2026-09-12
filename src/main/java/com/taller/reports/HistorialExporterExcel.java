package com.taller.reports;

import com.taller.entity.OrdenMantenimiento;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class HistorialExporterExcel {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<OrdenMantenimiento> listOrdenes;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public HistorialExporterExcel(List<OrdenMantenimiento> listOrdenes) {
        this.listOrdenes = listOrdenes;
        workbook = new XSSFWorkbook();
    }

    private void writeHeaderLine() {
        sheet = workbook.createSheet("Historial");
        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);

        createCell(row, 0, "ID", style);
        createCell(row, 1, "Fecha", style);
        createCell(row, 2, "Vehículo Placa", style);
        createCell(row, 3, "Cliente", style);
        createCell(row, 4, "Mecánico", style);
        createCell(row, 5, "Estado", style);
    }

    private void createCell(Row row, int columnCount, Object value, CellStyle style) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Long) {
            cell.setCellValue((Long) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    private void writeDataLines() {
        int rowCount = 1;

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14);
        style.setFont(font);

        for (OrdenMantenimiento o : listOrdenes) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(row, columnCount++, o.getId(), style);
            createCell(row, columnCount++, o.getFechaIngreso() != null ? o.getFechaIngreso().format(formatter) : "", style);
            
            String placa = o.getVehiculo() != null ? o.getVehiculo().getPlaca() : "";
            createCell(row, columnCount++, placa, style);
            
            String clienteName = o.getVehiculo() != null && o.getVehiculo().getCliente() != null 
                    ? o.getVehiculo().getCliente().getNombreCompleto() : "";
            createCell(row, columnCount++, clienteName, style);
            
            String mecanicoName = o.getMecanico() != null ? o.getMecanico().getNombreCompleto() : "";
            createCell(row, columnCount++, mecanicoName, style);
            
            createCell(row, columnCount++, o.getEstado() != null ? o.getEstado().name() : "", style);
        }
    }

    public void export(HttpServletResponse response) throws IOException {
        writeHeaderLine();
        writeDataLines();

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();

        outputStream.close();
    }
}
