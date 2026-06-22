import { Router } from 'express';
import { InventoryController } from '../controllers/inventory/Inventory.controller';

const router = Router();
const inventoryController = new InventoryController();

/**
 * @swagger
 * /api/v1/inventory/movements:
 *   post:
 *     summary: Registrar un movimiento de inventario
 *     tags:
 *       - Inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 1234567890123
 *               type:
 *                 type: string
 *                 enum: [entry, exit]
 *                 example: entry
 *               quantity:
 *                 type: number
 *                 example: 10
 *               reference:
 *                 type: string
 *                 example: Compra a proveedor X
 *               userId:
 *                 type: string
 *                 example: 64a8d1a2f1c2e3b4c5d6e7f8
 *               notes:
 *                 type: string
 *                 example: Ingreso de productos por compra
 *     responses:
 *       201:
 *         description: Movimiento de inventario registrado correctamente
 */

router.post('/movements', inventoryController.addMovement);

export default router;
