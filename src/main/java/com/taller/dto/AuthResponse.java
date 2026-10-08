package com.taller.dto;

public record AuthResponse(
        String token,
        String tipo,
        String username,
        String rol,
        long expiraEnSegundos
) {
}