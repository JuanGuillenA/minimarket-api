# Minimarket API 

**Universidad Politécnica Salesiana - Sede Cuenca**  
**Carrera:** Ingeniería en Ciencias de la Computación   
**Proyecto:** API REST para gestión de Minimarket

---

## Requerimientos 

El presente proyecto es una API RESTful desarrollada para cubrir las necesidades de gestión y administración de un Minimarket. El software cumple con los siguientes requerimientos principales:

- **Gestión de Catálogo:** Administración de productos disponibles en la tienda.
- **Gestión de Accesos:** Control de roles y perfiles de usuarios del sistema.
- **Gestión de Caja:** Procesamiento de transacciones, ventas y facturación.
- **Gestión de Abastecimiento:** Control de proveedores y reposición de stock.
- **Documentación Interactiva:** Integración con Swagger UI para la visualización y prueba de todos los endpoints.

---

## Descripciones de Diseño Arquitectónico 

Para garantizar la escalabilidad, mantenibilidad y el bajo acoplamiento del código, el backend fue desarrollado utilizando TypeScript y Node.js, implementando un patrón de diseño en capas estrictamente alineado con la estructura **Modelo - Repositorio - Servicio - Controlador**.

La estructura de carpetas `src/` se divide de la siguiente manera:

1. **`models/` (Modelos):** Contiene los esquemas de datos y entidades utilizando Mongoose. Representan la estructura exacta de las colecciones en la base de datos MongoDB.
2. **`repositories/` (Repositorios):** Capa encargada exclusivamente de la interacción directa con la base de datos (Data Access Layer). Aquí se ejecutan operaciones CRUD aislando al resto del sistema de la lógica de persistencia.
3. **`services/` (Servicios):** Contiene la lógica de negocio pura de la aplicación. Recibe peticiones de los controladores, procesa las reglas de negocio y se comunica con los repositorios.
4. **`controllers/` (Controladores):** Capa encargada de manejar las peticiones HTTP (Request/Response), extraer los parámetros del cliente, delegar el trabajo a los servicios y retornar la respuesta en formato JSON.
5. **`routes/` (Rutas):** Define los endpoints de la API y los vincula con los métodos específicos de cada controlador.

---

## Descripción

API REST para la gestión de un supermercado/minimarket, implementada como backend con Node.js, Express y TypeScript.

El proyecto sigue la arquitectura modelo/repositorio/controlador/servicio y ofrece documentación Swagger para todas sus rutas.

---

## Objetivos específicos del trabajo

1. Crear aplicaciones utilizando herramientas de ingeniería de software.
2. Comprender el manejo de un equipo de desarrollo de software mediante la organización de tareas y componentes.
3. Implementar un backend funcional con una estructura escalable y documentada.
4. Publicar servicios REST con documentación Swagger.
5. Seguir las instrucciones del ejercicio y cumplir los requisitos de la guía de la tarea.

---

## Estructura del proyecto

- `src/config` - configuración de base de datos y Swagger.
- `src/models` - modelos de datos de Mongoose para cada módulo.
- `src/repositories` - acceso a datos y operaciones sobre la base de datos.
- `src/services` - lógica de negocio y validaciones.
- `src/controllers` - controladores HTTP que atienden las solicitudes.
- `src/routes` - definición de rutas API y documentación Swagger.
- `src/server.ts` - punto de entrada del servidor.

---

## Funcionalidades implementadas

- Gestión de catálogo de productos.
- Gestión de suministro y órdenes de reposición.
- Gestión de checkout, ventas, caja, movimientos y cierre de caja.
- Gestión de usuarios, roles y autenticación.
- Gestión de clientes.
- Registro de movimientos de inventario.
- Generación de reportes de inventario, ventas y clientes.
- Documentación Swagger activa en `/api-docs`.

---

## Instrucciones de instalación

1. Clonar el repositorio.
2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz con al menos estas variables:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/minimarket
JWT_SECRET=secret
```

4. Iniciar la base de datos local. Asegúrese de tener MongoDB Community Server ejecutándose en su máquina:

```bash
brew services start mongodb-community
```

5. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

---

## Endpoints principales

La documentación Swagger está disponible en:

```text
http://localhost:5001/api-docs
```

Rutas implementadas:

- `GET /api/v1/health` - verifica que el servicio está activo.
- `GET/POST /api/v1/catalog` - gestión de artículos.
- `GET/POST /api/v1/supply` - gestión de proveedores y órdenes de reposición.
- `GET/POST /api/v1/checkout/registers` - creación y listado de cajas.
- `POST /api/v1/checkout/transactions` - procesar ventas.
- `POST /api/v1/checkout/movements` - registrar movimientos de caja.
- `POST /api/v1/checkout/close` - cerrar caja y realizar arqueo.
- `GET/POST /api/v1/clients` - gestión de clientes.
- `POST /api/v1/inventory/movements` - movimientos de inventario.
- `GET /api/v1/reports/inventory` - reporte de inventario.
- `GET /api/v1/reports/sales` - reporte de ventas.
- `GET /api/v1/reports/clients` - reporte de clientes.
- `GET/POST /api/v1/access` - autenticación y roles.

---

## Cómo probar la aplicación

1. Verificar que MongoDB esté en ejecución.
2. Ejecutar el servidor con `npm run dev`.
3. Abrir `http://localhost:5001/api-docs` para usar Swagger.
4. Probar los endpoints desde Swagger, Postman o curl.

Ejemplo rápido con curl:

```bash
curl http://localhost:5001/api/v1/health
```

Para compilar y verificar tipos:

```bash
npx tsc --noEmit
```

---

## Observaciones finales

- El backend usa TypeScript y Express.
- Swagger está disponible en `/api-docs`.
- El puerto por defecto es `5001`.
- Si se desea probar, solo necesita clonar el repositorio, ejecutar `npm install`, configurar `.env` y correr `npm run dev`.

---

## Distribución de tareas y commits

El trabajo fue desarrollado de manera colaborativa utilizando Git y GitHub, asegurando que cada integrante construyera el flujo completo (Modelo > Repositorio > Servicio > Controlador > Ruta) de su módulo asignado.

| Integrante | Rol / Módulo Asignado |
| :--- | :--- |
| **Juan Guillén** | Arquitectura base, Conexión BD, Swagger y Módulo Principal. |
| **Ariel Solano** | Módulo de Catálogo / Inventario. |
| **Jorge Pizarro** | Módulo de Abastecimiento (Proveedores). |
| **Kevin Sinchi** | Módulo de Caja y Transacciones. |
| **Sebastian Verdugo** | Módulo de Accesos y Usuarios. |



