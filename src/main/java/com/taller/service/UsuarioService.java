package com.taller.service;

import com.taller.entity.Usuario;
import java.util.List;

public interface UsuarioService {

    List<Usuario> listarTodos();

    Usuario guardar(Usuario usuario);

    Usuario buscarPorId(Long id);

    void eliminar(Long id);

}