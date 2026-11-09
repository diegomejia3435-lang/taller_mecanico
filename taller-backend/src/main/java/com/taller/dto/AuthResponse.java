package com.taller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthResponse(
        String token,
        @JsonProperty("accessToken")
        String accessToken,
        String tipo,
        @JsonProperty("tokenType")
        String tokenType,
        String username,
        String rol,
        long expiraEnSegundos
) {
    public AuthResponse(String token, String tipo, String username, String rol, long expiraEnSegundos) {
        this(token, token, tipo, tipo, username, rol, expiraEnSegundos);
    }
}