================================================================================
                    PROYECTO TALLER MECANICO - GUIA DE USO Y ESTRUCTURA
================================================================================

Este archivo contiene la guia rapida paso a paso para ejecutar el proyecto tanto en
su Backend (Spring Boot 3 + MySQL) como en su Frontend (Angular + SCSS), probar
las APIs en Postman y entender la arquitectura monorepo del codigo fuente.

--------------------------------------------------------------------------------
1. PASOS PARA PONER EN MARCHA EL BACKEND Y FRONTEND
--------------------------------------------------------------------------------

REQUISITOS PREVIOS:
- Java JDK 21 instalado.
- Node.js (v20 o superior) y npm instalados.
- Angular CLI instalado globalmente (`npm install -g @angular/cli`).
- Servidor MySQL ejecutandose en localhost:3306 con credenciales:
  * Usuario: root
  * Contrasena: 1234
  (MODIFICAR "application.properties" EN "taller-backend/src/main/resources" SI LOS DATOS SON DISTINTOS)
  * Base de datos: taller_mecanico (se crea automaticamente si no existe)

--------------------------------------------------
A. PUESTA EN MARCHA DEL BACKEND (SPRING BOOT 3)
--------------------------------------------------
1. Abre una terminal en la subcarpeta del backend:
   cd taller-backend

2. Inicia la aplicacion Spring Boot con el wrapper de Maven:
   .\mvnw.cmd spring-boot:run

   La API estara disponible en:
   URL Base: http://localhost:8080

3. Ejecutar la suite completa de 13 pruebas automatizadas del backend:
   $env:JAVA_HOME="C:\Users\frank\.jdks\ms-21.0.11"
   .\mvnw.cmd test

   Pruebas especificas:
   - Seguridad y JWT:        .\mvnw.cmd test -Dtest=AuthRestControllerTest
   - Transaccion y Rollback: .\mvnw.cmd test -Dtest=OrdenServiceTransactionTest
   - Consulta JPQL:          .\mvnw.cmd test -Dtest=ClienteRepositoryTest
   - Contrato REST MockMvc:  .\mvnw.cmd test -Dtest=ClienteRestControllerTest

--------------------------------------------------
B. PUESTA EN MARCHA DEL FRONTEND (ANGULAR + SCSS)
--------------------------------------------------
1. Abre una terminal en la subcarpeta del frontend:
   cd taller-frontend

2. (Opcional, si es la primera vez o faltan paquetes):
   npm install

3. Inicia el servidor de desarrollo de Angular:
   ng serve --open

   La aplicacion web se abrira automaticamente en el navegador en:
   URL Base: http://localhost:4200


--------------------------------------------------------------------------------
2. INTEGRACION DE TEMAS DEL 3ER AVANCE (FRONTEND + BACKEND)
--------------------------------------------------------------------------------

El 3er avance integra la aplicacion Frontend en Angular con el Backend en Spring Boot
cumpliendo con la rubrica de evaluacion por componentes y responsabilidades:

1. PROYECTO ANGULAR ORGANIZADO:
   - Estructurado por componentes Standalone (sin NgModules) con responsabilidades claras.
   - Componente raiz `app.ts` gestionando el catalogo y estado reactivo con Signals.
   - Componente `encabezado` reutilizable con entradas `input()` y eventos `output()`.
   - Componente `tarjeta-servicio` reutilizable con `input.required<Servicio>()` y `output()`.
   - Renderizado declarativo con `@for (s of servicios(); track s.id)`.
   - Arquitectura de estilos SCSS con tokens en `_variables.scss` ($primary, $radius, $space),
     mixins configurables en `_mixins.scss` (@mixin boton, @mixin tarjeta-base), anidamiento
     con selector `&` y diseno adaptativo responsive (Escritorio -> Tablet -> Movil).
   - Validacion de estado de disponibilidad (`disponible: boolean`) con estilos y boton condicional.

2. RUTAS PRINCIPALES:
   - Configuracion de navegacion en `app.routes.ts` soportada por `<router-outlet />`.
   - Preparado para transitar entre Login, Dashboard, Clientes, Vehiculos y Ordenes.

3. FORMULARIOS CON VALIDACION:
   - Formularios reactivos (ReactiveFormsModule) para la captura de datos con validaciones
     en tiempo real y mensajes de error visibles para el usuario.

4. CONSUMO REAL DE API REST:
   - Servicios Angular (HttpClient) inyectables configurados para consumir los endpoints
     de Spring Boot en `http://localhost:8080/api/...`.
   - CORS habilitado en el Backend para permitir solicitudes desde `http://localhost:4200`.

5. CRUD VISIBLE DESDE FRONTEND:
   - Tablas y vistas interactivas para Listar, Crear (POST 201), Modificar (PUT/PATCH)
     y Eliminar (DELETE 204) recursos principales del taller mecanico.

6. MANEJO DE ERRORES HTTP:
   - Interceptor HTTP que captura y muestra alertas legibles ante respuestas 400 (Bad Request),
     401 (Unauthorized), 403 (Forbidden), 404 (Not Found) o 409 (Conflict).

7. AUTENTICACION DESDE ANGULAR:
   - Pantalla de inicio de sesion (Login), almacenamiento seguro del token JWT en el cliente,
     AuthInterceptor para inyectar la cabecera `Authorization: Bearer <token>` en peticiones
     protegidas y AuthGuard para restringir rutas segun rol.

8. EVIDENCIA END-TO-END:
   - Flujo completo observable desde la interfaz Angular, procesado por la logica de negocio
     en Spring Boot y persistido en la base de datos relacional MySQL.


--------------------------------------------------------------------------------
3. PASOS PARA PROBAR LAS APIS EN POSTMAN
--------------------------------------------------------------------------------

UBICACION DE LA COLECCION POSTMAN:
El archivo JSON de la coleccion se encuentra en la siguiente ruta:
   taller-backend/postman/collections/TallerMecanico_API.postman_collection.json

PASO 1: IMPORTAR LA COLECCION EN POSTMAN
1. Abre la aplicacion Postman.
2. Haz clic en el boton "Import" (arriba a la izquierda).
3. Selecciona el archivo:
   taller-backend/postman/collections/TallerMecanico_API.postman_collection.json
4. Presiona "Import". Veras cargada la coleccion:
   "Taller Mecánico API - Pruebas REST, JWT, CORS, JPQL y Transacciones"

PASO 2: AUTENTICACION JWT Y VARIABLES DINAMICAS
- La coleccion cuenta con variables dinamicas de coleccion:
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
4. MATRIZ DE ENDPOINTS DEL BACKEND (SPRING BOOT)
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

taller_modificado/                                 <-- Raiz del Repositorio Monorepo Git
│
├── .git/                                          <-- Control de versiones Git (taller_mecanico.git).
├── .gitattributes                                 <-- Reglas globales de normalizacion de fin de linea.
├── .gitignore                                     <-- Reglas globales de exclusion (IDE, temporales).
├── README.txt                                     <-- Este archivo guia de uso y arquitectura.
│
├── taller-backend/                                <-- PROYECTO BACKEND (Spring Boot 3 + MySQL + JWT)
│   ├── pom.xml                                    --> Configuracion Maven y dependencias (Spring Boot 3, Security, JPA, MySQL).
│   ├── mvnw / mvnw.cmd                            --> Wrapper ejecutable de Maven.
│   │
│   ├── postman/
│   │   └── collections/
│   │       └── TallerMecanico_API.postman_collection.json  --> Coleccion de 17 pruebas automatizadas Postman v2.1.
│   │
│   └── src/
│       ├── main/
│       │   ├── java/com/taller/
│       │   │   ├── TallerApplication.java         --> Clase principal ejecutable de Spring Boot.
│       │   │   ├── config/                        --> Configuraciones (SecurityConfig con CORS localhost:4200, GlobalExceptionHandler).
│       │   │   ├── controller/api/                --> Controladores REST API (Auth, Cliente, Vehiculo, Orden, Usuario).
│       │   │   ├── dto/                           --> DTOs (LoginRequest, AuthResponse con token Bearer).
│       │   │   ├── entity/                        --> Entidades JPA (Cliente, Vehiculo, OrdenMantenimiento, Usuario, Rol, Servicio).
│       │   │   ├── repository/                    --> Repositorios JPA con consultas JPQL (LIKE, BETWEEN, GROUP BY).
│       │   │   ├── security/                      --> Servicios de seguridad (JwtService, JwtAuthFilter, CustomUserDetailsService).
│       │   │   └── service/impl/                  --> Logica de negocio y transacciones atomicas con @Transactional Rollback.
│       │   └── resources/
│       │       └── application.properties         --> Propiedades del datasource MySQL y puerto 8080.
│       │
│       └── test/                                  --> Suite de 13 pruebas automatizadas (MockMvc, DataJpaTest, SpringBootTest).
│           └── java/com/taller/
│               ├── controller/api/                --> Pruebas de contrato HTTP (AuthRestControllerTest, ClienteRestControllerTest).
│               ├── repository/                    --> Pruebas de JPQL con base de datos real (ClienteRepositoryTest).
│               └── service/                       --> Pruebas unitarias Mockito y de Rollback (OrdenServiceTransactionTest).
│
└── taller-frontend/                               <-- PROYECTO FRONTEND (Angular v22 + SCSS Standalone)
    ├── package.json                               --> Dependencias Node.js y scripts de Angular.
    ├── angular.json                               --> Configuracion de compilacion y assets de Angular CLI.
    ├── tsconfig.json                              --> Configuracion de TypeScript.
    │
    └── src/
        ├── main.ts                                --> Punto de arranque de la aplicacion Angular.
        ├── index.html                             --> Plantilla HTML base del navegador.
        ├── styles.scss                            --> Estilos globales y reset tipografico.
        │
        ├── styles/                                --> Arquitectura de diseno modular SCSS
        │   ├── _variables.scss                    --> Tokens de color ($primary: #e85d26), radios, espacios y sombras.
        │   └── _mixins.scss                       --> Mixins de botones (@mixin boton) y responsive (@mixin tablet, mobile).
        │
        └── app/
            ├── app.ts                             --> Componente raiz Standalone con Signals reactivos y catalogo de taller.
            ├── app.html                           --> Plantilla con @for, comunicacion input/output y <router-outlet />.
            ├── app.scss                           --> Cuadricula responsive (3 columnas escritorio -> 2 tablet -> 1 movil).
            ├── app.routes.ts                      --> Definicion de rutas principales de la aplicacion.
            │
            ├── models/
            │   └── servicio.model.ts              --> Interfaz TypeScript para Servicio automotriz.
            │
            └── components/                        --> Componentes Standalone reutilizables
                ├── encabezado/                    --> Componente de barra superior
                │   ├── encabezado.ts              --> input() y output() para contadores y eventos.
                │   ├── encabezado.html            --> Marca, titulo y badge interactivo de servicios.
                │   └── encabezado.scss            --> Anidamiento SCSS y mixin responsive.
                │
                └── tarjeta-servicio/              --> Componente de tarjeta de servicio
                    ├── tarjeta-servicio.ts        --> input.required<Servicio>() y emision output<Servicio>().
                    ├── tarjeta-servicio.html      --> Precios, categorias, icono y control de disponibilidad.
                    └── tarjeta-servicio.scss      --> Uso de @include tarjeta-base y @include boton().

================================================================================
