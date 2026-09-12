package com.taller.reports;

import com.taller.entity.Vehiculo;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import java.io.IOException;
import java.util.List;

public class VehiculoExporterExcel {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<Vehiculo> listVehiculos;

    public VehiculoExporterExcel(List<Vehiculo> listVehiculos) {
        this.listVehiculos = listVehiculos;
        workbook = new XSSFWorkbook();
    }

    private void writeHeaderLine() {
        sheet = workbook.createSheet("Vehiculos");
        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);

        createCell(row, 0, "ID", style);
        createCell(row, 1, "Placa", style);
        createCell(row, 2, "Marca", style);
        createCell(row, 3, "Modelo", style);
        createCell(row, 4, "Año", style);
        createCell(row, 5, "Tipo Motor", style);
        createCell(row, 6, "Propietario", style);
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

        for (Vehiculo v : listVehiculos) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(row, columnCount++, v.getId(), style);
            createCell(row, columnCount++, v.getPlaca() != null ? v.getPlaca() : "", style);
            createCell(row, columnCount++, v.getMarca() != null ? v.getMarca() : "", style);
            createCell(row, columnCount++, v.getModelo() != null ? v.getModelo() : "", style);
            createCell(row, columnCount++, v.getAnio() != null ? v.getAnio() : 0, style);
            createCell(row, columnCount++, v.getTipoMotor() != null ? v.getTipoMotor() : "", style);
            
            String ownerName = v.getCliente() != null ? v.getCliente().getNombreCompleto() : "";
            createCell(row, columnCount++, ownerName, style);
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
