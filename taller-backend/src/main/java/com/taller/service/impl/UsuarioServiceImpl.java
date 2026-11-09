package com.taller.service.impl;

import com.taller.entity.Usuario;
import com.taller.repository.UsuarioRepository;
import com.taller.service.UsuarioService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl
        implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public List<Usuario> listarTodos() {

        return usuarioRepository.findAll();

    }

    @Override
    public Usuario guardar(Usuario usuario) {

        if (usuario.getId() != null) {

            Usuario usuarioBD = usuarioRepository
                    .findById(usuario.getId())
                    .orElse(null);

            if (usuarioBD != null) {

                if (usuario.getPassword() == null ||
                        usuario.getPassword().isBlank()) {

                    usuario.setPassword(
                            usuarioBD.getPassword()
                    );

                } else {

                    usuario.setPassword(
                            passwordEncoder.encode(
                                    usuario.getPassword()
                            )
                    );

                }

            }

        } else {

            usuario.setPassword(
                    passwordEncoder.encode(
                            usuario.getPassword()
                    )
            );

        }

        return usuarioRepository.save(usuario);

    }

    @Override
    public Usuario buscarPorId(Long id) {

        return usuarioRepository.findById(id).orElse(null);

    }

    @Override
    public void eliminar(Long id) {

        usuarioRepository.deleteById(id);

    }

}