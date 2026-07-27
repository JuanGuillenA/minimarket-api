# Mercado Uno — Frontend del Minimarket

Aplicación web desarrollada con React y TypeScript para consumir la API REST del
proyecto `minimarket-api`. Centraliza las operaciones diarias de catálogo,
inventario, abastecimiento, clientes, caja, usuarios y reportes.

## Requisitos

- Node.js 22 o superior.
- Backend `minimarket-api` disponible.
- MongoDB configurado para el backend.

## Instalación

```bash
npm install
```

Copia `.env.example` como `.env.local` si la API utiliza otra dirección:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

Inicia la aplicación:

```bash
npm run dev
```

La interfaz estará disponible en `http://localhost:3000`.

## Funcionalidades

- Dashboard con ventas, stock, caja y alertas de reposición.
- Punto de venta con carrito, cliente, descuento y forma de pago.
- Creación, movimiento y cierre de cajas.
- Catálogo de productos y secciones.
- Entradas y salidas de inventario.
- Proveedores y órdenes de reposición.
- Registro y actualización de clientes.
- Creación de usuarios y roles.
- Reportes de ventas, inventario y clientes frecuentes.
- Diseño adaptable para escritorio, tablet y móvil.

## Integración con la API

El cliente HTTP se encuentra en `app/api.ts`. Todas las respuestas exitosas del
backend se interpretan con el formato:

```ts
{
  success: true;
  data: unknown;
}
```

Los errores se muestran mediante notificaciones en la interfaz. Cuando toda la
API está fuera de línea, el frontend activa un modo de demostración identificado
visualmente. Este modo permite recorrer las pantallas, pero no reemplaza la
integración real.

## Consideraciones conocidas del backend

- El campo `productId` de movimientos de inventario debe recibir el código de
  barras.
- Registrar una reposición no incrementa automáticamente el stock; el ingreso
  correspondiente se registra desde Inventario.
- Para abrir una caja se crea con estado `open`, porque no existe un endpoint
  separado de apertura.
- La seguridad y protección JWT de rutas no forman parte del alcance actual.

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # compilación de producción
npm test         # compilación y pruebas del HTML renderizado
npm run lint     # análisis estático
```

## Organización sugerida del trabajo

Para cumplir la guía académica, se recomienda crear tareas o issues por módulo,
asignarlas a los integrantes y realizar commits pequeños y descriptivos. Cada
integrante debe participar en el historial y el repositorio debe alcanzar al
menos 20 commits reales antes de la entrega.
