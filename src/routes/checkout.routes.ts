import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout/Checkout.controller';

const router = Router();
const checkoutController = new CheckoutController();

/**
 * @swagger
 * /api/v1/checkout/registers:
 *   get:
 *     summary: Obtener todos los registros de caja
 *     tags:
 *       - Checkout
 *     responses:
 *       200:
 *         description: Lista de registros de caja
 *   post:
 *     summary: Crear un nuevo registro de caja
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registerNumber:
 *                 type: number
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: open
 *     responses:
 *       201:
 *         description: Registro de caja guardado correctamente
 *
 * /api/v1/checkout/transactions:
 *   post:
 *     summary: Procesar una nueva venta
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registerId:
 *                 type: string
 *                 example: 64a8d1a2f1c2e3b4c5d6e7f8
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, transfer]
 *                 example: cash
 *               itemsSold:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     articleCode:
 *                       type: string
 *                       example: 1234567890123
 *                     quantity:
 *                       type: number
 *                       example: 3
 *                     unitPrice:
 *                       type: number
 *                       example: 2.5
 *     responses:
 *       201:
 *         description: Transacción procesada correctamente
 */

router.get('/registers', checkoutController.getRegisters);
router.post('/registers', checkoutController.addRegister);
router.post('/transactions', checkoutController.processNewSale);

export default router;