================================================================================
                    PROYECTO TALLER MECANICO - GUIA DE USO Y ESTRUCTURA
================================================================================

Este archivo contiene la guia rapida paso a paso para ejecutar el proyecto, probar
las APIs en Postman con JWT y CORS, y entender la estructura del codigo fuente.

--------------------------------------------------------------------------------
1. PASOS PARA EJECUTAR EL PROYECTO Y PRUEBAS
--------------------------------------------------------------------------------

REQUISITOS PREVIOS:
- Java JDK 21 instalado.
- Servidor MySQL ejecutandose en localhost:3306 con credenciales:
  * Usuario: root
  * Contrasena: 1234
(MODIFICAR "application.properties" UBICADO EN "src/main/resources" SI LOS DATOS DE MYSQL DEL USUARIO SON DISTINTOS) 
  * Base de datos: taller_mecanico (se crea automaticamente si no existe)

PASO 1: EJECUTAR LA APLICACION SPRING BOOT
Abre una terminal o consola de comandos en la carpeta raiz del proyecto y ejecuta:

   mvn spring-boot:run

O si utilizas el wrapper de Maven incluido:

   mvnw.cmd spring-boot:run

La aplicacion iniciara y estara disponible en:
   URL Base: http://localhost:8080

PASO 2: EJECUTAR LAS PRUEBAS AUTOMATIZADAS (TDD, JPQL Y TRANSACCIONES)
Para ejecutar la suite completa de 13 pruebas automatizadas (Service, MockMvc, JPA y JWT):

   $env:JAVA_HOME="C:\Users\frank\.jdks\ms-21.0.11"
   .\mvnw test

Veras en la consola que todas las 13 pruebas compilan y pasan en VERDE (BUILD SUCCESS).


--------------------------------------------------------------------------------
2. INTEGRACION DE TEMAS DEL 2DO AVANCE
--------------------------------------------------------------------------------

1. MIGRACION A BASE DE DATOS RELACIONAL: Persistencia con JPA/Hibernate sobre MySQL.
2. CRUD PERSISTENTE: Recursos principales guardan y recuperan datos desde MySQL.
3. CONSULTAS JPQL UTILES:
   - LIKE: ClienteRepository.buscarPorNombreODni ("GET /api/clientes/buscar?texto=juan")
   - BETWEEN: VehiculoRepository.buscarPorRangoAnio ("GET /api/vehiculos/rango-anio?min=2018&max=2025")
   - GROUP BY: OrdenRepository.obtenerEstadisticasPorEstado ("GET /api/ordenes/estadisticas/por-estado")
4. OPERACION TRANSACCIONAL:
   - Método @Transactional en OrdenServiceImpl (reasignarMecanicoAtomiico) que ejecuta ROLLBACK automático si el mecánico no existe.
5. SPRING SECURITY CON ROLES:
   - Roles diferenciados: ROLE_ADMIN, ROLE_MECANICO, ROLE_CLIENTE.
6. AUTENTICACION JWT Y CORS:
   - Endpoint "POST /api/auth/login", generación de tokens JWT con JwtService, filtro JwtAuthFilter (Stateless) y CORS habilitado para "http://localhost:4200".
7. TESTS ACTUALIZADOS:
   - 13 pruebas automatizadas ejecutadas en verde con "mvnw test" (BUILD SUCCESS).
8. POSTMAN ACTUALIZADO:
   - Colección JSON automatizada con Login JWT, captura de token, pruebas 401/403, CORS, JPQL y Rollback.


--------------------------------------------------------------------------------
3. PASOS PARA PROBAR LAS APIS EN POSTMAN
--------------------------------------------------------------------------------

UBICACION DE LA COLECCION POSTMAN:
El archivo JSON de la coleccion se encuentra en la siguiente ruta del proyecto:
   postman/collections/TallerMecanico_API.postman_collection.json

PASO 1: IMPORTAR LA COLECCION EN POSTMAN
1. Abre la aplicacion Postman.
2. Haz clic en el boton "Import" (arriba a la izquierda).
3. Selecciona el archivo:
   taller_modificado/postman/collections/TallerMecanico_API.postman_collection.json
4. Presiona "Import". Veras cargada la coleccion:
   "Taller Mecánico API - Pruebas REST, JWT, CORS, JPQL y Transacciones"

PASO 2: AUTENTICACION JWT Y VARIABLES DINAMICAS
- La coleccion cuenta con variables dinámicas de colección:
  * baseUrl = http://localhost:8080
  * adminToken (se llena automaticamente tras ejecutar el Login Admin)
  * mecanicoToken (se llena automaticamente tras ejecutar el Login Mecanico)
  * clienteId (se actualiza automaticamente al crear clientes)

PASO 3: EJECUTAR PETICIONES EN SECUENCIA DE PRUEBA
1. "01. Auth - Login Admin (Guardar Token)" (POST /api/auth/login) -> Status 200 OK, guarda adminToken.
2. "02. Auth - Login Mecanico (Guardar Token)" (POST /api/auth/login) -> Status 200 OK, guarda mecanicoToken.
3. "03. Seguridad - Sin Token (401 Unauthorized)" (GET /api/clientes) -> Status 401 Unauthorized.
4. "04. Seguridad - Rol Insuficiente (403 Forbidden)" (GET /api/clientes con Bearer mecanicoToken) -> Status 403 Forbidden.
5. "05. Listar Clientes (200 OK con Admin Token)" (GET /api/clientes con Bearer adminToken) -> Status 200 OK.
6. "06. Crear Cliente (201 Created)" (POST /api/clientes) -> Retorna Location header y guarda clienteId.
7. "07. Obtener Cliente Creado por ID" (GET /api/clientes/{{clienteId}}) -> Status 200 OK.
8. "08. Actualizar Cliente Completo" (PUT /api/clientes/{{clienteId}}) -> Status 200 OK.
9. "09. Actualizacion Parcial" (PATCH /api/clientes/{{clienteId}}) -> Status 200 OK.
10. "10. Eliminar Cliente" (DELETE /api/clientes/{{clienteId}}) -> Status 204 No Content.
11. "11. Error 404 - Consultar ID Inexistente" (GET /api/clientes/999999) -> Status 404 Not Found.
12. "12. Error 400 - Crear con Datos Invalidos" (POST /api/clientes) -> Status 400 Bad Request con fieldErrors.
13. "13. Busqueda JPQL con LIKE" (GET /api/clientes/buscar?texto=juan) -> Status 200 OK.
14. "14. Rango de Anio JPQL BETWEEN" (GET /api/vehiculos/rango-anio?min=2018&max=2025) -> Status 200 OK.
15. "15. Estadisticas JPQL GROUP BY" (GET /api/ordenes/estadisticas/por-estado) -> Status 200 OK.
16. "16. Transaccion Fallida (ROLLBACK 404)" (POST /api/ordenes/transacciones/reemplazar-mecanico?ordenId=1&nuevoMecanicoId=999999) -> Status 404 Not Found.
17. "17. Prueba CORS Preflight (OPTIONS)" (OPTIONS /api/clientes) -> Status 200/204 con Access-Control-Allow-Origin: http://localhost:4200.

PASO 4: EJECUTAR LA COLECCION COMPLETA (COLLECTION RUNNER)
1. Haz clic derecho sobre la coleccion en Postman.
2. Selecciona "Run collection".
3. Haz clic en "Run Taller Mecanico API".
4. Todas las 17 peticiones se ejecutaran en secuencia pasando el 100% de las pruebas en verde.


--------------------------------------------------------------------------------
4. MATRIZ DE ENDPOINTS ACTUALIZADA
--------------------------------------------------------------------------------

| Método  | Endpoint                                                  | Descripción                               | Rol Requerido / Seguridad      |
| ------- | --------------------------------------------------------- | ----------------------------------------- | ------------------------------ |
| POST    | `/api/auth/login`                                         | Login JWT (devuelve token Bearer)         | Público (PermitAll)            |
| GET     | `/api/clientes`                                           | Listar todos los clientes                 | ROLE_ADMIN                     |
| GET     | `/api/clientes/{id}`                                      | Obtener cliente por ID                    | ROLE_ADMIN                     |
| POST    | `/api/clientes`                                           | Registrar nuevo cliente (201 Created)     | ROLE_ADMIN                     |
| PUT     | `/api/clientes/{id}`                                      | Actualizar cliente completo               | ROLE_ADMIN                     |
| PATCH   | `/api/clientes/{id}`                                      | Actualización parcial del cliente         | ROLE_ADMIN                     |
| DELETE  | `/api/clientes/{id}`                                      | Eliminar cliente (204 No Content)         | ROLE_ADMIN                     |
| GET     | `/api/clientes/buscar?texto={texto}`                      | Consulta JPQL LIKE por nombre o DNI       | ROLE_ADMIN                     |
| GET     | `/api/vehiculos`                                          | Listar vehículos                          | ROLE_ADMIN, ROLE_MECANICO      |
| GET     | `/api/vehiculos/{id}`                                     | Obtener vehículo por ID                   | ROLE_ADMIN, ROLE_MECANICO      |
| GET     | `/api/vehiculos/rango-anio?min={min}&max={max}`            | Consulta JPQL BETWEEN por año vehículo    | ROLE_ADMIN, ROLE_MECANICO      |
| POST    | `/api/vehiculos`                                          | Registrar vehículo                        | ROLE_ADMIN                     |
| PUT     | `/api/vehiculos/{id}`                                     | Actualizar vehículo                       | ROLE_ADMIN                     |
| DELETE  | `/api/vehiculos/{id}`                                     | Eliminar vehículo                         | ROLE_ADMIN                     |
| GET     | `/api/ordenes`                                            | Listar órdenes de mantenimiento           | ROLE_ADMIN, ROLE_MECANICO      |
| GET     | `/api/ordenes/estadisticas/por-estado`                    | Consulta JPQL GROUP BY estadísticas orden | ROLE_ADMIN, ROLE_MECANICO      |
| POST    | `/api/ordenes/transacciones/reemplazar-mecanico`          | Operación atómica @Transactional Rollback | ROLE_ADMIN                     |
| GET     | `/api/usuarios`                                           | Listar usuarios                           | ROLE_ADMIN                     |
| GET     | `/api/usuarios/{id}`                                      | Obtener usuario por ID                    | ROLE_ADMIN                     |
| POST    | `/api/usuarios`                                           | Crear usuario                             | ROLE_ADMIN                     |
| PUT     | `/api/usuarios/{id}`                                      | Actualizar usuario                        | ROLE_ADMIN                     |
| DELETE  | `/api/usuarios/{id}`                                      | Eliminar usuario                          | ROLE_ADMIN                     |
| OPTIONS | `/api/**`                                                 | Validación Preflight CORS (localhost:4200)| Público                        |


--------------------------------------------------------------------------------
5. ESTRUCTURA DEL PROYECTO Y ARCHIVOS PRINCIPALES
--------------------------------------------------------------------------------

taller_modificado/
│
├── pom.xml                        --> Archivo de configuracion Maven y dependencias (Spring Boot 3, Security JWT, JPA, Validation, Lombok, OpenPDF, Apache POI).
├── README.md                      --> Documentacion completa del proyecto en formato Markdown.
├── README.txt                     --> Guia rapida en texto plano.
├── LEEME.txt                      --> Este archivo guia rapida en texto plano.
│
├── postman/
│   └── collections/
│       └── TallerMecanico_API.postman_collection.json  --> Coleccion de pruebas automatizadas para Postman v2.1 (JWT, CORS, JPQL, Transacciones).
│
├── src/
│   ├── main/
│   │   ├── java/com/taller/
│   │   │   ├── TallerApplication.java      --> Clase principal ejecutable de Spring Boot.
│   │   │   │
│   │   │   ├── config/                     --> Configuraciones globales.
│   │   │   │   ├── SecurityConfig.java     --> Configuracion de Spring Security (Stateless JWT, CORS http://localhost:4200, roles ADMIN/MECANICO/CLIENTE).
│   │   │   │   └── GlobalExceptionHandler.java --> ControllerAdvice para traducir excepciones a respuestas HTTP 400 y 404 en JSON.
│   │   │   │
│   │   │   ├── controller/                 --> Controladores de la aplicacion.
│   │   │   │   ├── api/                    --> Controladores REST API.
│   │   │   │   │   ├── AuthRestController.java      --> Endpoint POST /api/auth/login para autenticacion JWT.
│   │   │   │   │   ├── ClienteRestController.java   --> Endpoints REST para Cliente (GET, POST 201, PUT, PATCH, DELETE 204, JPQL LIKE).
│   │   │   │   │   ├── OrdenRestController.java     --> Endpoints REST para Ordenes (JPQL GROUP BY y @Transactional Rollback).
│   │   │   │   │   ├── UsuarioRestController.java   --> Endpoints REST para Usuarios.
│   │   │   │   │   └── VehiculoRestController.java  --> Endpoints REST para Vehiculos (JPQL BETWEEN).
│   │   │   │   ├── ClienteController.java  --> Controlador MVC para vistas HTML Thymeleaf.
│   │   │   │   ├── OrdenController.java    --> Controlador MVC para Ordenes de Trabajo.
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── dto/                        --> Data Transfer Objects.
│   │   │   │   ├── LoginRequest.java       --> DTO de solicitud de inicio de sesion (username, password).
│   │   │   │   └── AuthResponse.java       --> DTO de respuesta de autenticacion (token JWT, tipo Bearer, usuario, rol).
│   │   │   │
│   │   │   ├── entity/                     --> Entidades de dominio JPA (Modelos).
│   │   │   │   ├── Cliente.java            --> Entidad Cliente con validaciones de Bean Validation (@NotBlank, @Pattern, @Email).
│   │   │   │   ├── Vehiculo.java           --> Entidad Vehiculo vinculada a Cliente (@ManyToOne).
│   │   │   │   ├── OrdenMantenimiento.java --> Entidad Orden de Trabajo.
│   │   │   │   ├── Usuario.java            --> Entidad Usuario del sistema de seguridad.
│   │   │   │   ├── Rol.java                --> Entidad Rol de seguridad.
│   │   │   │   └── Servicio.java           --> Entidad Servicio del catalogo del taller.
│   │   │   │
│   │   │   ├── exception/                  --> Excepciones personalizadas de dominio.
│   │   │   │   └── ResourceNotFoundException.java --> Excepcion para recursos no encontrados (404).
│   │   │   │
│   │   │   ├── repository/                 --> Repositorios Spring Data JPA (Capa de Acceso a Datos).
│   │   │   │   ├── ClienteRepository.java  --> Interfaz DAO con consulta JPQL @Query (LIKE).
│   │   │   │   ├── VehiculoRepository.java --> Interfaz DAO con consulta JPQL @Query (BETWEEN).
│   │   │   │   ├── OrdenRepository.java    --> Interfaz DAO con consulta JPQL @Query (GROUP BY).
│   │   │   │   └── UsuarioRepository.java  --> Interfaz DAO para usuarios y autenticacion.
│   │   │   │
│   │   │   ├── security/                   --> Componentes de Autenticacion JWT.
│   │   │   │   ├── JwtService.java         --> Servicio de generacion y validacion de tokens JWT.
│   │   │   │   ├── JwtAuthFilter.java      --> Filtro HTTP OncePerRequestFilter para interceptar cabeceras Authorization.
│   │   │   │   └── CustomUserDetailsService.java --> Carga de UserDetails desde base de datos MySQL.
│   │   │   │
│   │   │   ├── service/                    --> Capa de Logica de Negocio.
│   │   │   │   ├── ClienteService.java     --> Interfaz del servicio Cliente.
│   │   │   │   ├── impl/
│   │   │   │   │   ├── ClienteServiceImpl.java --> Implementacion del servicio Cliente.
│   │   │   │   │   └── OrdenServiceImpl.java   --> Servicio de Ordenes con metodo @Transactional (reasignarMecanicoAtomiico).
│   │   │   │   └── DataInitializer.java    --> Carga inicial automatica de usuarios (admin, mecanico), roles y datos en MySQL.
│   │   │   │
│   │   │   └── reports/                    --> Generadores de reportes PDF y Excel.
│   │   │
│   │   └── resources/
│   │       ├── application.properties     --> Propiedades del proyecto (datasource MySQL, JPA, puerto 8080).
│   │       ├── static/                    --> Archivos estaticos (CSS, JS, Imagenes).
│   │       └── templates/                 --> Vistas HTML Thymeleaf.
│   │
│   └── test/
│       └── java/com/taller/
│           ├── controller/api/
│           │   ├── AuthRestControllerTest.java     --> Pruebas MockMvc de autenticacion JWT (200 OK y 401 Unauthorized).
│           │   └── ClienteRestControllerTest.java  --> Pruebas MockMvc de contrato REST (201 Created, 204, 400, 404).
│           ├── repository/
│           │   └── ClienteRepositoryTest.java      --> Pruebas de consultas JPQL con @DataJpaTest.
│           ├── service/
│           │   ├── ClienteServiceTest.java         --> Pruebas unitarias de Service con Mockito.
│           │   └── OrdenServiceTransactionTest.java --> Pruebas de Rollback transaccional con @SpringBootTest.
│           └── TallerApplicationTests.java         --> Prueba de carga de contexto Spring Boot.

================================================================================
