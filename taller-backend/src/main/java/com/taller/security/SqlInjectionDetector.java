package com.taller.security;

import java.util.List;
import java.util.regex.Pattern;

/**
 * Detecta patrones tipicos de inyeccion SQL/JPQL en un texto.
 * Es una capa extra de defensa: la defensa principal sigue siendo usar
 * consultas parametrizadas (:parametro) y nunca concatenar strings.
 */
public final class SqlInjectionDetector {

    private static final int FLAGS = Pattern.CASE_INSENSITIVE | Pattern.DOTALL;

    private static final List<Pattern> PATRONES = List.of(
            // UNION SELECT
            Pattern.compile("\\bunion\\b\\s+(all\\s+)?select\\b", FLAGS),
            // SELECT ... FROM
            Pattern.compile("\\bselect\\b.+\\bfrom\\b", FLAGS),
            // INSERT INTO / DELETE FROM / UPDATE x SET
            Pattern.compile("\\b(insert\\s+into|delete\\s+from|update\\s+\\w+\\s+set)\\b", FLAGS),
            // DROP/TRUNCATE/ALTER/CREATE TABLE|DATABASE|SCHEMA
            Pattern.compile("\\b(drop|truncate|alter|create)\\s+(table|database|schema)\\b", FLAGS),
            // comilla seguida de OR / AND  ->  ' OR '1'='1
            Pattern.compile("'\\s*(or|and)\\b", FLAGS),
            // OR 1=1  /  AND 'a'='a'
            Pattern.compile("\\b(or|and)\\b\\s+['\"]?\\w+['\"]?\\s*(=|<|>|\\blike\\b)", FLAGS),
            // ';  o  ; DROP ...
            Pattern.compile("'\\s*;|;\\s*(select|insert|update|delete|drop|truncate|alter|exec)\\b", FLAGS),
            // comentarios SQL
            Pattern.compile("--|/\\*|\\*/", FLAGS),
            // inyeccion ciega por tiempo
            Pattern.compile("\\b(sleep|benchmark)\\s*\\(|\\bwaitfor\\s+delay\\b", FLAGS)
    );

    private SqlInjectionDetector() {
    }

    public static boolean esSospechoso(String texto) {
        if (texto == null || texto.isBlank()) {
            return false;
        }
        String t = texto.replaceAll("(?i)\\\\u0027", "'"); // \u0027 escapado en JSON = comilla simple
        for (Pattern p : PATRONES) {
            if (p.matcher(t).find()) {
                return true;
            }
        }
        return false;
    }
}