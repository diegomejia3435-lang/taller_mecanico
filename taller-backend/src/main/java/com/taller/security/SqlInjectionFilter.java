package com.taller.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Revisa la ruta, los parametros y el cuerpo JSON de cada peticion a /api/**.
 * Si detecta un patron de inyeccion SQL responde 403 antes de llegar al login,
 * a los controladores o a MySQL. Aplica igual a ADMIN, MECANICO o sin sesion.
 */
public class SqlInjectionFilter extends OncePerRequestFilter {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod()); // preflight de CORS
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        HttpServletRequest peticion = request;
        String cuerpo = "";

        String contentType = request.getContentType();
        if (contentType != null && contentType.toLowerCase().contains("json")) {
            CachedBodyRequest copia = new CachedBodyRequest(request);
            cuerpo = new String(copia.getBody(), StandardCharsets.UTF_8);
            peticion = copia; // el controlador todavia podra leer el cuerpo
        }

        String ruta = decodificar(request.getRequestURI());
        String query = decodificar(request.getQueryString());

        if (SqlInjectionDetector.esSospechoso(ruta)
                || SqlInjectionDetector.esSospechoso(query)
                || SqlInjectionDetector.esSospechoso(cuerpo)) {
            logger.warn("Posible inyeccion SQL bloqueada: " + request.getMethod() + " "
                    + request.getRequestURI() + " desde " + request.getRemoteAddr());
            bloquear(request, response);
            return;
        }

        chain.doFilter(peticion, response);
    }

    private String decodificar(String texto) {
        if (texto == null) {
            return "";
        }
        try {
            return URLDecoder.decode(texto, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return texto; // %xx mal formado: se revisa tal cual
        }
    }

    private void bloquear(HttpServletRequest req, HttpServletResponse res) throws IOException {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", 403);
        body.put("error", "Forbidden");
        body.put("message", "Solicitud bloqueada: se detectaron patrones de inyección SQL");
        body.put("path", req.getRequestURI());

        res.setStatus(HttpServletResponse.SC_FORBIDDEN);
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.setCharacterEncoding("UTF-8");
        mapper.writeValue(res.getOutputStream(), body);
    }

    /** Guarda el cuerpo en memoria para poder leerlo dos veces (filtro y controlador). */
    private static class CachedBodyRequest extends HttpServletRequestWrapper {

        private final byte[] body;

        CachedBodyRequest(HttpServletRequest request) throws IOException {
            super(request);
            this.body = request.getInputStream().readAllBytes();
        }

        byte[] getBody() {
            return body;
        }

        @Override
        public ServletInputStream getInputStream() {
            ByteArrayInputStream in = new ByteArrayInputStream(body);
            return new ServletInputStream() {
                @Override
                public boolean isFinished() {
                    return in.available() == 0;
                }

                @Override
                public boolean isReady() {
                    return true;
                }

                @Override
                public void setReadListener(ReadListener listener) {
                }

                @Override
                public int read() {
                    return in.read();
                }
            };
        }

        @Override
        public BufferedReader getReader() {
            return new BufferedReader(new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
        }
    }
}