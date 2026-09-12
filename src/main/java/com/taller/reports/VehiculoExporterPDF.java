package com.taller.reports;

import com.taller.entity.Vehiculo;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;
import java.awt.Color;
import java.io.IOException;
import java.util.List;

public class VehiculoExporterPDF {
    private List<Vehiculo> listVehiculos;

    public VehiculoExporterPDF(List<Vehiculo> listVehiculos) {
        this.listVehiculos = listVehiculos;
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(26, 26, 46)); // #1a1a2e
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);

        cell.setPhrase(new Phrase("ID", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Placa", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Marca", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Modelo", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Año", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Tipo Motor", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Propietario", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table) {
        for (Vehiculo v : listVehiculos) {
            table.addCell(String.valueOf(v.getId()));
            table.addCell(v.getPlaca() != null ? v.getPlaca() : "");
            table.addCell(v.getMarca() != null ? v.getMarca() : "");
            table.addCell(v.getModelo() != null ? v.getModelo() : "");
            table.addCell(v.getAnio() != null ? String.valueOf(v.getAnio()) : "");
            table.addCell(v.getTipoMotor() != null ? v.getTipoMotor() : "");
            
            String ownerName = v.getCliente() != null ? v.getCliente().getNombreCompleto() : "";
            table.addCell(ownerName);
        }
    }

    public void export(HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(18);
        font.setColor(new Color(26, 26, 46)); // #1a1a2e

        Paragraph p = new Paragraph("Lista de Vehículos", font);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(p);

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {1.0f, 2.0f, 2.0f, 2.0f, 1.5f, 2.0f, 3.0f});
        table.setSpacingBefore(10);

        writeTableHeader(table);
        writeTableData(table);

        document.add(table);
        document.close();
    }
}
