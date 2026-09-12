package com.taller.reports;

import com.taller.entity.Cliente;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;
import java.awt.Color;
import java.io.IOException;
import java.util.List;

public class ClienteExporterPDF {
    private List<Cliente> listClientes;

    public ClienteExporterPDF(List<Cliente> listClientes) {
        this.listClientes = listClientes;
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(26, 26, 46)); // #1a1a2e
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);

        cell.setPhrase(new Phrase("ID", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Nombre Completo", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("DNI", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Teléfono", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Correo", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table) {
        for (Cliente c : listClientes) {
            table.addCell(String.valueOf(c.getId()));
            table.addCell(c.getNombreCompleto() != null ? c.getNombreCompleto() : "");
            table.addCell(c.getDni() != null ? c.getDni() : "");
            table.addCell(c.getTelefono() != null ? c.getTelefono() : "");
            table.addCell(c.getCorreo() != null ? c.getCorreo() : "");
        }
    }

    public void export(HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(18);
        font.setColor(new Color(26, 26, 46)); // #1a1a2e

        Paragraph p = new Paragraph("Lista de Clientes", font);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(p);

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {1.0f, 3.0f, 2.0f, 2.0f, 3.0f});
        table.setSpacingBefore(10);

        writeTableHeader(table);
        writeTableData(table);

        document.add(table);
        document.close();
    }
}
