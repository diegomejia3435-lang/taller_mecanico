package com.taller.controller.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taller.config.GlobalExceptionHandler;
import com.taller.entity.Cliente;
import com.taller.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ClienteRestControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ClienteService clienteService;

    @InjectMocks
    private ClienteRestController clienteRestController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Cliente clienteExistente;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(clienteRestController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        clienteExistente = new Cliente();
        clienteExistente.setId(1L);
        clienteExistente.setNombreCompleto("Juan Perez");
        clienteExistente.setDni("77777777");
        clienteExistente.setTelefono("955555555");
        clienteExistente.setCorreo("juan@gmail.com");
    }

    @Test
    @DisplayName("MockMvc Test 1: POST /api/clientes exitoso retorna 201 Created y header Location")
    void crearCliente_exito_retorna201YLocation() throws Exception {
        Cliente nuevoCliente = new Cliente(null, "Carlos Gomez", "12345678", "987654321", "carlos@gmail.com", null);
        Cliente clienteGuardado = new Cliente(10L, "Carlos Gomez", "12345678", "987654321", "carlos@gmail.com", null);

        when(clienteService.guardar(any(Cliente.class))).thenReturn(clienteGuardado);

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevoCliente)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/api/clientes/10")))
                .andExpect(jsonPath("$.id", is(10)))
                .andExpect(jsonPath("$.nombreCompleto", is("Carlos Gomez")))
                .andExpect(jsonPath("$.dni", is("12345678")));
    }

    @Test
    @DisplayName("MockMvc Test 2: GET /api/clientes/{id} inexistente retorna 404 Not Found")
    void obtenerCliente_noExiste_retorna404() throws Exception {
        when(clienteService.buscarPorId(999L)).thenReturn(null);

        mockMvc.perform(get("/api/clientes/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("Cliente con ID 999 no encontrado")));
    }

    @Test
    @DisplayName("MockMvc Test 3: POST /api/clientes con DNI inválido retorna 400 Bad Request")
    void crearCliente_datosInvalidos_retorna400BadRequest() throws Exception {
        Cliente clienteInvalido = new Cliente(null, "Pedro Perez", "123", "999888777", "pedro.com", null);

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(clienteInvalido)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.fieldErrors.dni", notNullValue()));
    }

    @Test
    @DisplayName("MockMvc Test 4: DELETE /api/clientes/{id} exitoso retorna 204 No Content")
    void eliminarCliente_exito_retorna204() throws Exception {
        when(clienteService.buscarPorId(1L)).thenReturn(clienteExistente);
        doNothing().when(clienteService).eliminar(1L);

        mockMvc.perform(delete("/api/clientes/1"))
                .andExpect(status().isNoContent());
    }
}
