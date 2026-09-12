================================================================================
                    PROYECTO TALLER MECANICO - GUIA DE USO Y ESTRUCTURA
================================================================================

Este archivo contiene la guia rapida paso a paso para ejecutar el proyecto, probar
las APIs en Postman y entender la estructura del codigo fuente.

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

PASO 2: EJECUTAR LAS PRUEBAS AUTOMATIZADAS (TDD)
Para ejecutar la suite de pruebas unitarias (Service) y de contrato HTTP (MockMvc):

   $env:JAVA_HOME="C:\Users\frank\.jdks\ms-21.0.11"
   .\mvnw test

Veras en la consola que todas las pruebas compilan y pasan en VERDE (BUILD SUCCESS).


--------------------------------------------------------------------------------
2. PASOS PARA PROBAR LAS APIS EN POSTMAN
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
   "Taller Mecanico API - Pruebas REST (APF1)"

PASO 2: AUTENTICACION Y VARIABLES
- La coleccion usa autenticacion Basic Auth preconfigurada:
  * Usuario: admin
  * Contrasena: 1234
- Posee variables de coleccion dinamicas (baseUrl = http://localhost:8080 y clienteId).

PASO 3: EJECUTAR PETICIONES INDIVIDUALES
1. "1. Listar Clientes" (GET /api/clientes) -> Status 200 OK.
2. "2. Crear Cliente" (POST /api/clientes) -> Status 201 Created.
   * Retorna el encabezado "Location" con la URI del nuevo cliente.
   * Guarda automaticamente el nuevo ID en la variable "clienteId".
3. "3. Obtener Cliente por ID" (GET /api/clientes/{{clienteId}}) -> Status 200 OK.
4. "4. Actualizar Cliente Completo" (PUT /api/clientes/{{clienteId}}) -> Status 200 OK.
5. "5. Actualizacion Parcial" (PATCH /api/clientes/{{clienteId}}) -> Status 200 OK.
6. "6. Eliminar Cliente" (DELETE /api/clientes/{{clienteId}}) -> Status 204 No Content.

PASO 4: PROBAR CASOS DE ERROR 4XX
7. "7. Error 404 - Consultar ID Inexistente" (GET /api/clientes/999999)
   -> Valida respuesta HTTP 404 Not Found con mensaje JSON estructurado.
8. "8. Error 400 - Crear con Datos Invalidos" (POST /api/clientes)
   -> Envia datos vacios o DNI invalido y valida respuesta HTTP 400 Bad Request
      con desglose en "fieldErrors".

PASO 5: EJECUTAR LA COLECCION COMPLETA (COLLECTION RUNNER)
1. Haz clic derecho sobre la coleccion "Taller Mecanico API - Pruebas REST (APF1)".
2. Selecciona "Run collection".
3. Haz clic en "Run Taller Mecanico API".
4. Todas las peticiones se ejecutaran en secuencia pasando el 100% de las pruebas en verde.

--------------------------------------------------------------------------------
3. MATRIZ DE ENDPOINTS
--------------------------------------------------------------------------------

| Método | Endpoint              | Descripción               | Rol sugerido                   |
| ------ | --------------------- | ------------------------- | ------------------------------ |
| GET    | `/api/clientes`       | Listar todos los clientes | ADMIN, RECEPCIONISTA           |
| GET    | `/api/clientes/{id}`  | Obtener cliente por ID    | ADMIN, RECEPCIONISTA           |
| POST   | `/api/clientes`       | Registrar nuevo cliente   | ADMIN, RECEPCIONISTA           |
| PUT    | `/api/clientes/{id}`  | Actualizar cliente        | ADMIN, RECEPCIONISTA           |
| DELETE | `/api/clientes/{id}`  | Eliminar cliente          | ADMIN                          |
| GET    | `/api/vehiculos`      | Listar vehículos          | ADMIN, RECEPCIONISTA, MECANICO |
| GET    | `/api/vehiculos/{id}` | Obtener vehículo por ID   | ADMIN, RECEPCIONISTA, MECANICO |
| POST   | `/api/vehiculos`      | Registrar vehículo        | ADMIN, RECEPCIONISTA           |
| PUT    | `/api/vehiculos/{id}` | Actualizar vehículo       | ADMIN, RECEPCIONISTA           |
| DELETE | `/api/vehiculos/{id}` | Eliminar vehículo         | ADMIN                          |
| GET    | `/api/usuarios`       | Listar usuarios           | ADMIN                          |
| GET    | `/api/usuarios/{id}`  | Obtener usuario por ID    | ADMIN                          |
| POST   | `/api/usuarios`       | Crear usuario             | ADMIN                          |
| PUT    | `/api/usuarios/{id}`  | Actualizar usuario        | ADMIN                          |
| DELETE | `/api/usuarios/{id}`  | Eliminar usuario          | ADMIN                          |


--------------------------------------------------------------------------------
4. ESTRUCTURA DEL PROYECTO Y ARCHIVOS PRINCIPALES
--------------------------------------------------------------------------------

taller_modificado/
│
├── pom.xml                        --> Archivo de configuracion Maven y dependencias (Spring Boot, Security, JPA, Validation, Lombok, OpenPDF, Apache POI).
├── README.md                      --> Documentacion completa del proyecto en formato Markdown.
├── LEEME.txt                      --> Este archivo guia rapida en texto plano.
│
├── postman/
│   └── collections/
│       └── TallerMecanico_API.postman_collection.json  --> Coleccion de pruebas automatizadas para Postman v2.1.
│
├── src/
│   ├── main/
│   │   ├── java/com/taller/
│   │   │   ├── TallerApplication.java      --> Clase principal ejecutable de Spring Boot.
│   │   │   │
│   │   │   ├── config/                     --> Configuraciones globales.
│   │   │   │   ├── SecurityConfig.java     --> Configuracion de Spring Security (HTTP Basic, roles ADMIN/MECANICO/CLIENTE).
│   │   │   │   └── GlobalExceptionHandler.java --> ControllerAdvice para traducir excepciones a respuestas HTTP 400 y 404 en JSON.
│   │   │   │
│   │   │   ├── controller/                 --> Controladores de la aplicacion.
│   │   │   │   ├── api/                    --> Controladores REST API.
│   │   │   │   │   ├── ClienteRestController.java   --> Endpoints REST para Cliente (GET, POST 201, PUT, PATCH, DELETE 204).
│   │   │   │   │   ├── UsuarioRestController.java   --> Endpoints REST para Usuarios.
│   │   │   │   │   └── VehiculoRestController.java  --> Endpoints REST para Vehiculos.
│   │   │   │   ├── ClienteController.java  --> Controlador MVC para vistas HTML.
│   │   │   │   ├── OrdenController.java    --> Controlador MVC para Ordenes de Trabajo.
│   │   │   │   └── ...
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
│   │   │   │   ├── ClienteRepository.java  --> Interfaz DAO para Cliente.
│   │   │   │   ├── VehiculoRepository.java --> Interfaz DAO para Vehiculo.
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── service/                    --> Capa de Logica de Negocio.
│   │   │   │   ├── ClienteService.java     --> Interfaz del servicio Cliente.
│   │   │   │   ├── impl/
│   │   │   │   │   └── ClienteServiceImpl.java --> Implementacion del servicio Cliente con inyeccion por constructor.
│   │   │   │   └── DataInitializer.java    --> Carga inicial automatica de usuarios, roles y datos de prueba al arrancar.
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
│           ├── service/
│           │   └── ClienteServiceTest.java           --> Pruebas unitarias de Service con Mockito.
│           └── controller/api/
│               └── ClienteRestControllerTest.java   --> Pruebas de contrato HTTP con MockMvc (201 Created, 204, 400, 404).

================================================================================
