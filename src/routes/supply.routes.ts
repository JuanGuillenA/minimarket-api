import { Router } from 'express';
import { SupplyController } from '../controllers/supply/Supply.controller';

const router = Router();
const supplyController = new SupplyController();

/**
 * @swagger
 * /api/v1/supply/suppliers:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags:
 *       - Suministros
 *     responses:
 *       200:
 *         description: Lista de proveedores registrados
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags:
 *       - Suministros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: Proveedor ABC
 *               contactEmail:
 *                 type: string
 *                 example: contacto@abc.com
 *               phoneNumber:
 *                 type: string
 *                 example: +51 987654321
 *     responses:
 *       201:
 *         description: Proveedor creado correctamente
 *
 * /api/v1/supply/restock:
 *   post:
 *     summary: Crear una orden de reposición
 *     tags:
 *       - Suministros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId:
 *                 type: string
 *                 example: 64a8d1a2f1c2e3b4c5d6e7f8
 *               itemsReceived:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     articleCode:
 *                       type: string
 *                       example: 1234567890123
 *                     quantity:
 *                       type: number
 *                       example: 20
 *                     unitCost:
 *                       type: number
 *                       example: 1.5
 *     responses:
 *       201:
 *         description: Orden de reposición creada correctamente
 */

router.get('/suppliers', supplyController.getSuppliers);
router.post('/suppliers', supplyController.addSupplier);
router.post('/restock', supplyController.addRestockOrder);

export default router;