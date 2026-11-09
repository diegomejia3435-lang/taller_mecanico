package com.taller.reports;

import com.taller.entity.Cliente;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import java.io.IOException;
import java.util.List;

public class ClienteExporterExcel {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<Cliente> listClientes;

    public ClienteExporterExcel(List<Cliente> listClientes) {
        this.listClientes = listClientes;
        workbook = new XSSFWorkbook();
    }

    private void writeHeaderLine() {
        sheet = workbook.createSheet("Clientes");
        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);

        createCell(row, 0, "ID", style);
        createCell(row, 1, "Nombre Completo", style);
        createCell(row, 2, "DNI", style);
        createCell(row, 3, "Teléfono", style);
        createCell(row, 4, "Correo", style);
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

        for (Cliente c : listClientes) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(row, columnCount++, c.getId(), style);
            createCell(row, columnCount++, c.getNombreCompleto() != null ? c.getNombreCompleto() : "", style);
            createCell(row, columnCount++, c.getDni() != null ? c.getDni() : "", style);
            createCell(row, columnCount++, c.getTelefono() != null ? c.getTelefono() : "", style);
            createCell(row, columnCount++, c.getCorreo() != null ? c.getCorreo() : "", style);
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
