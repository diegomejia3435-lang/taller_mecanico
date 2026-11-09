package com.taller.controller.api;

import com.taller.dto.AuthResponse;
import com.taller.dto.LoginRequest;
import com.taller.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthRestController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of(
                    "status", 401,
                    "error", "Unauthorized",
                    "message", "Usuario o contraseña incorrectos"));
        }

        UserDetails user = (UserDetails) auth.getPrincipal();
        String rol = user.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority()).orElse("ROLE_USER");

        return ResponseEntity.ok(new AuthResponse(
                jwtService.generarToken(user),
                "Bearer",
                user.getUsername(),
                rol,
                jwtService.getExpirationMs() / 1000));
    }
}
