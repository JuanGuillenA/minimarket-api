import { Router } from 'express';
import { CatalogController } from '../controllers/catalog/Catalog.controller';

const router = Router();
const catalogController = new CatalogController();

/**
 * @swagger
 * /api/v1/catalog/articles:
 *   get:
 *     summary: Obtener todos los artículos
 *     tags:
 *       - Catálogo
 *     responses:
 *       200:
 *         description: Lista de artículos disponibles
 *   post:
 *     summary: Crear un nuevo artículo
 *     tags:
 *       - Catálogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *                 example: 1234567890123
 *               name:
 *                 type: string
 *                 example: Leche
 *               retailPrice:
 *                 type: number
 *                 example: 2.5
 *               sectionId:
 *                 type: string
 *                 example: 64a8d1a2f1c2e3b4c5d6e7f8
 *     responses:
 *       201:
 *         description: Artículo creado correctamente
 *
 * /api/v1/catalog/sections:
 *   get:
 *     summary: Obtener todas las secciones
 *     tags:
 *       - Catálogo
 *     responses:
 *       200:
 *         description: Lista de secciones del supermercado
 *   post:
 *     summary: Crear una nueva sección
 *     tags:
 *       - Catálogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lácteos
 *               description:
 *                 type: string
 *                 example: Productos de refrigerados
 *     responses:
 *       201:
 *         description: Sección creada correctamente
 */

// Rutas de inventario y catálogo
router.get('/articles', catalogController.getArticles);
router.post('/articles', catalogController.addArticle);

router.get('/sections', catalogController.getSections);
router.post('/sections', catalogController.addSection);

export default router;