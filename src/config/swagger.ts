import swaggerUi from 'swagger-ui-express';
const swaggerJSDoc = require('swagger-jsdoc');
import { Application } from 'express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Minimarket API',
            version: '1.0.0',
            description: 'Documentación oficial de los servicios del supermercado'
        },
    },
    // Aquí le decimos a Swagger en qué archivos están tus comentarios
    apis: ['./src/routes/*.ts'] 
};

// Generamos la especificación escaneando las rutas
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger documentation available at /api-docs');
};