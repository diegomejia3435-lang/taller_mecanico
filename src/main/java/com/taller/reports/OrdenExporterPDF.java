package com.taller.reports;

import com.taller.entity.OrdenMantenimiento;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;
import java.awt.Color;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class OrdenExporterPDF {
    private List<OrdenMantenimiento> listOrdenes;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public OrdenExporterPDF(List<OrdenMantenimiento> listOrdenes) {
        this.listOrdenes = listOrdenes;
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(26, 26, 46)); // #1a1a2e
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);

        cell.setPhrase(new Phrase("ID", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Cliente", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Placa Vehículo", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Mecánico", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Fecha Ingreso", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Fecha Salida", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Estado", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table) {
        for (OrdenMantenimiento o : listOrdenes) {
            table.addCell(String.valueOf(o.getId()));
            
            String clienteName = o.getVehiculo() != null && o.getVehiculo().getCliente() != null 
                    ? o.getVehiculo().getCliente().getNombreCompleto() : "";
            table.addCell(clienteName);
            
            String placa = o.getVehiculo() != null ? o.getVehiculo().getPlaca() : "";
            table.addCell(placa);
            
            String mecanicoName = o.getMecanico() != null ? o.getMecanico().getNombreCompleto() : "";
            table.addCell(mecanicoName);
            
            table.addCell(o.getFechaIngreso() != null ? o.getFechaIngreso().format(formatter) : "");
            table.addCell(o.getFechaSalida() != null ? o.getFechaSalida().format(formatter) : "-");
            table.addCell(o.getEstado() != null ? o.getEstado().name() : "");
        }
    }

    public void export(HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4.rotate()); // Horizontal for more columns
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(18);
        font.setColor(new Color(26, 26, 46)); // #1a1a2e

        Paragraph p = new Paragraph("Reporte de Órdenes de Mantenimiento", font);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(p);

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {1.0f, 3.0f, 2.0f, 3.0f, 3.0f, 3.0f, 2.0f});
        table.setSpacingBefore(10);

        writeTableHeader(table);
        writeTableData(table);

        document.add(table);
        document.close();
    }
}
