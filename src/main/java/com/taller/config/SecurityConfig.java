package com.taller.config;

import com.taller.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/login", "/css/**", "/js/**", "/debug-roles", "/error").permitAll()

                        .requestMatchers("/usuarios/**", "/clientes/**", "/vehiculos/**", "/reportes/**", "/exportar/**", "/mecanicos/**", "/api/**").hasRole("ADMIN")

                        .requestMatchers("/ordenes/nuevo", "/ordenes/eliminar/**").hasRole("ADMIN")
                        .requestMatchers("/ordenes", "/ordenes/editar/**", "/ordenes/guardar").hasAnyRole("ADMIN", "MECANICO")

                        .requestMatchers("/historial/**").hasAnyRole("ADMIN", "MECANICO", "CLIENTE")

                        .anyRequest().authenticated()
                )

                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/", true)
                        .permitAll()
                )

                .httpBasic(org.springframework.security.config.Customizer.withDefaults())

                .logout(logout -> logout
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}