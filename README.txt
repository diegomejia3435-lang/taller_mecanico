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
- Java JDK 17 o superior (recomendado JDK 21).
- Node.js (v18 o superior / v20+) y npm instalados.
- Servidor MySQL ejecutandose en el puerto 3306.
- Git (opcional, para clonar el repositorio).

--------------------------------------------------
A. CLONAR O DESCARGAR EL REPOSITORIO
--------------------------------------------------
Desde una terminal de comandos:
   git clone https://github.com/diegomejia3435-lang/taller_mecanico.git
   cd taller_mecanico

--------------------------------------------------
B. CONFIGURACION DE LA BASE DE DATOS (MYSQL)
--------------------------------------------------
1. Asegurate de que el servicio de MySQL este activo en el puerto 3306.
2. Abre el archivo "taller-backend/src/main/resources/application.properties" y verifica
   que las credenciales coincidan con las de tu MySQL local:
      spring.datasource.url=jdbc:mysql://localhost:3306/taller_mecanico?createDatabaseIfNotExist=true
      spring.datasource.username=root
      spring.datasource.password=123456
   * La base de datos "taller_mecanico" y sus tablas se crearan automaticamente al iniciar el backend.

--------------------------------------------------
C. PUESTA EN MARCHA DEL BACKEND (SPRING BOOT 3)
--------------------------------------------------
1. Abre una terminal en la subcarpeta del backend:
   cd taller-backend

2. Inicia la aplicacion Spring Boot con el wrapper de Maven:
   * En Windows:
     .\mvnw.cmd spring-boot:run
   * En Linux / macOS:
     ./mvnw spring-boot:run
   (Tambien puedes abrir la carpeta "taller-backend" en IntelliJ IDEA, Eclipse o VS Code
    y ejecutar la clase principal TallerApplication.java).

   La API estara disponible en:
   URL Base: http://localhost:8080

3. (Opcional) Ejecutar la suite de 13 pruebas automatizadas del backend:
   .\mvnw.cmd test

   Pruebas especificas:
   - Seguridad y JWT:        .\mvnw.cmd test -Dtest=AuthRestControllerTest
   - Transaccion y Rollback: .\mvnw.cmd test -Dtest=OrdenServiceTransactionTest
   - Consulta JPQL:          .\mvnw.cmd test -Dtest=ClienteRepositoryTest
   - Contrato REST MockMvc:  .\mvnw.cmd test -Dtest=ClienteRestControllerTest

--------------------------------------------------
D. PUESTA EN MARCHA DEL FRONTEND (ANGULAR + SCSS)
--------------------------------------------------
1. Abre una segunda terminal en la subcarpeta del frontend:
   cd taller-frontend

2. Instala las dependencias del proyecto:
   npm install

3. Inicia el servidor de desarrollo de Angular:
   npm start
   (o: ng serve --open)

   La aplicacion web estara disponible en:
   URL Base: http://localhost:4200

--------------------------------------------------
E. INGRESO AL SISTEMA (CREDENCIALES DE DEMOSTRACION)
--------------------------------------------------
Abre en el navegador: http://localhost:4200
- Administrador: usuario: admin  / clave: 1234 (control total del taller)
- Mecanico:      usuario: carlos / clave: 1234 (gestion de ordenes asignadas)


--------------------------------------------------------------------------------
2. INTEGRACION DE TEMAS DEL 3ER AVANCE (FRONTEND + BACKEND)
--------------------------------------------------------------------------------

El proyecto culmina la migracion integral de una arquitectura monolitica (Thymeleaf)
hacia una arquitectura cliente-servidor desacoplada con Single Page Application (SPA)
en Angular v22 Standalone y Backend REST API en Spring Boot 3 con Spring Security y JWT:

1. ARQUITECTURA ANGULAR MODULAR Y STANDALONE:
   - Eliminacion de la dependencia en NgModules: el 100% de la aplicacion opera mediante
     componentes Standalone organizados en carpetas modulares:
     * pages/        -> Vistas principales (Login, Dashboard, Clientes, Vehiculos,
                        Ordenes, Mecanicos, Historial, Reportes, Usuarios, Exportar).
     * components/   -> Componentes comunes (Sidebar navegacion lateral, Topbar cabecera).
     * services/     -> Capa asincrona de comunicacion y estado con HttpClient.
     * models/       -> Interfaces y tipos TypeScript tipados estrictamente.
     * guards/       -> Guardianes de enrutamiento y autorizacion RBAC.
   - Estado reactivo impulsado por Signals (`signal()`, `computed()`), asegurando
     actualizaciones ultrarrapidas sin sobrecargar el ciclo de deteccion de cambios.
   - Arquitectura SCSS modular basada en tokens (`_variables.scss`), mixins responsive
     (`_mixins.scss`) y diseno adaptativo completo (Desktop, Tablet y Mobile).
   - Sidebar con posicionamiento fijo/sticky (`position: sticky; top: 0; height: 100vh;`)
     que acompana la navegacion durante el scroll continuo, eliminando huecos blancos.
   - Tablas estilizadas con celdas no rompibles (`white-space: nowrap;`) y anchos
     definidos, junto a una interfaz sobria sin emojis superfluos en formularios y listados.

2. SISTEMA DE RUTAS Y SEGURIDAD RBAC (ROLE GUARDS):
   - Mapeo de rutas centralizado en `app.routes.ts` con proteccion integral mediante `role.guard.ts`.
   - Control de permisos identico al backend Spring Security:
     * ROLE_ADMIN: Acceso total a todos los modulos (Dashboard, Clientes, Vehiculos,
       Ordenes, Mecanicos, Historial, Reportes, Usuarios y Exportar).
     * ROLE_MECANICO: Acceso restringido exclusivamente a la gestion de ordenes de trabajo
       asignadas (/ordenes). El Sidebar y Topbar ocultan automaticamente las opciones
       administrativas, y el Route Guard bloquea e impide el ingreso por URL redirigiendo a /ordenes.

3. FORMULARIOS REACTIVOS CON VALIDACION ROBUSTA:
   - Formularios reactivos (ReactiveFormsModule) para Clientes, Vehiculos y Ordenes de Servicio.
   - Validaciones en tiempo real:
     * Clientes: DNI (exactamente 8 digitos numericos), telefono (9 digitos), email y nombres.
     * Vehiculos: Placa vehicular con formato estandar peruano (regex: 3 letras - 3 digitos),
       ano de fabricacion valido (1990 - 2026), numero de motor y asociacion al propietario.
     * Ordenes: Descripcion del servicio, diagnostico inicial, seleccion de mecanico y montos.
   - Mensajes de error claros e integrados visualmente sin desalinear la cuadricula de campos.

4. CONSUMO DE API REST Y ARQUITECTURA MONOREPO:
   - Desacoplamiento total: se eliminaron los controladores MVC y vistas Thymeleaf
     redundantes, dejando el backend puramente enfocado en proveer servicios REST API en
     `http://localhost:8080/api/...`.
   - Servicios Angular tipados (`auth.service.ts`, `cliente.service.ts`, `vehiculo.service.ts`,
     `orden.service.ts`, `dashboard.service.ts`) que gestionan solicitudes HTTP asincronas.
   - CORS habilitado globalmente en Spring Security para solicitudes originadas en `http://localhost:4200`.

5. GESTION CRUD COMPLETA Y EXPERIENCIA INTERACTIVA:
   - Operaciones de Listar, Registrar (POST 201), Actualizar (PUT/PATCH) y Eliminar (DELETE 204)
     con refresco instantaneo de la interfaz mediante senales reactivas.
   - Busqueda y filtrado interactivo en tiempo real en tablas de Clientes, Vehiculos y Ordenes.
   - Flujo de transicion de estados de ordenes de mantenimiento con un solo clic:
     * "Iniciar" (En proceso) -> "Finalizar" (Terminada) -> "Listo" (Entregada) -> "Anular".
   - Modulo de Exportacion con generacion de reportes estructurados en formato Microsoft Excel (.xlsx)
     y Documentos PDF (.pdf).

6. MANEJO DE ERRORES HTTP Y CONTROL DE EXCEPCIONES:
   - Tratamiento de codigos de respuesta HTTP con mensajes legibles para el usuario:
     400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found) y 409 (Conflict).
   - Pagina 404 de contingencia (`no-encontrado.page.ts`) con enlaces rapidos hacia las rutas
     principales habilitadas segun la sesion activa.

7. AUTENTICACION JWT Y SESION REACTIVA:
   - Pantalla de Login conectada con el endpoint de autenticacion de Spring Security.
   - Almacenamiento seguro del token JWT Bearer y datos del usuario en sesion.
   - Topbar dinamico que muestra el nombre completo del usuario autenticado, su rol asignado,
     avatar corporativo con iniciales y boton de cierre de sesion seguro.

8. EVIDENCIA END-TO-END Y LIMPIEZA DE CODIGO FUENTE:
   - Flujo de datos completo validado: SPA Angular -> Endpoints REST Spring Boot 3 ->
     JPA / Hibernate -> Base de Datos Relacional MySQL.
   - Refactorizacion y depuracion de archivos obsoletos (eliminacion de controladores Thymeleaf,
     plantillas HTML hibridas y codigo duplicado), garantizando un monorepo limpio y optimizado.


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
└── taller-frontend/                               <-- PROYECTO FRONTEND (Angular v22 Standalone + SCSS)
    ├── package.json                               --> Dependencias Node.js y scripts de Angular.
    ├── angular.json                               --> Configuracion de compilacion y assets de Angular CLI.
    ├── tsconfig.json                              --> Configuracion de TypeScript.
    │
    └── src/
        ├── main.ts                                --> Punto de arranque de la aplicacion Angular Standalone.
        ├── index.html                             --> Plantilla HTML base del navegador.
        ├── styles.scss                            --> Estilos globales, reset y fuentes.
        │
        ├── styles/                                --> Arquitectura de diseno modular SCSS
        │   ├── _variables.scss                    --> Tokens de color corporativos, radios, espacios y sombras.
        │   └── _mixins.scss                       --> Mixins para botones y diseno adaptativo (@mixin mobile).
        │
        └── app/
            ├── app.ts                             --> Componente raiz Standalone con integracion de layout.
            ├── app.html                           --> Layout estructural (Sidebar, Topbar y <router-outlet />).
            ├── app.scss                           --> Estilos del contenedor general y sticky viewport.
            ├── app.routes.ts                      --> Definicion de rutas SPA y proteccion con Role Guard.
            │
            ├── components/                        --> Componentes comunes de navegacion y cabecera
            │   ├── sidebar/                       --> Barra lateral corporativa sticky con enlaces segun rol activo.
            │   └── topbar/                        --> Barra superior con reloj, sesion, avatar e iniciales.
            │
            ├── guards/                            --> Control de acceso y proteccion de rutas
            │   └── role.guard.ts                  --> Guardia RBAC (ROLE_ADMIN vs ROLE_MECANICO).
            │
            ├── models/                            --> Modelos de datos e interfaces TypeScript tipadas
            │   ├── cliente.model.ts               --> Interfaz de Cliente.
            │   ├── vehiculo.model.ts              --> Interfaz de Vehiculo.
            │   ├── orden.model.ts                 --> Interfaz de Orden de Mantenimiento y estados.
            │   ├── usuario.model.ts               --> Interfaz de Usuario y roles de seguridad.
            │   ├── dashboard.model.ts             --> Modelos para metricas y estadisticas.
            │   └── servicio.model.ts              --> Interfaz de catalogo de Servicios automotrices.
            │
            ├── services/                          --> Servicios Angular con HttpClient y Signals
            │   ├── auth.service.ts                --> Gestion de sesion, login, logout, roles y token JWT.
            │   ├── cliente.service.ts             --> CRUD de clientes con reactividad y busqueda.
            │   ├── vehiculo.service.ts            --> CRUD de vehiculos y filtros por placa/propietario.
            │   ├── orden.service.ts               --> CRUD de ordenes y transiciones de estado de servicio.
            │   └── dashboard.service.ts           --> Metricas operativas y conteos para el panel principal.
            │
            └── pages/                             --> Vistas y modulos de la plataforma SPA
                ├── login/                         --> Formulario de inicio de sesion seguro.
                ├── dashboard/                     --> Metricas, resumen de actividad y accesos rapidos.
                ├── clientes/                      --> Listado con busqueda y formulario reactivo de clientes.
                ├── vehiculos/                     --> Catalogo con filtros y formulario reactivo con validacion de placa.
                ├── ordenes/                       --> Tablero de ordenes, transiciones de estado y creacion.
                ├── mecanicos/                     --> Plantilla tecnica calificada y asignacion de trabajo.
                ├── historial/                     --> Bitacora de atenciones concluidas e importes.
                ├── reportes/                      --> Metricas de ingresos y servicios de mayor demanda.
                ├── usuarios/                      --> Directorio de cuentas y credenciales RBAC.
                ├── exportar/                      --> Modulo de descarga estructurada en Excel (.xlsx) y PDF (.pdf).
                └── no-encontrado/                 --> Pagina 404 personalizada con rutas alternativas segun rol.

================================================================================
