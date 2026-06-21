import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Super Store API',
        version: '1.0.0',
        description: 'Documentación oficial de los servicios del supermercado'
    },
    paths: {}
};

export const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger documentation available at /api-docs');
};