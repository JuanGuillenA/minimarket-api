import { Router } from 'express';
import { ClientsController } from '../controllers/clients/Clients.controller';

const router = Router();
const clientsController = new ClientsController();

/**
 * @swagger
 * /api/v1/clients:
 *   get:
 *     summary: Obtener todos los clientes registrados
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags:
 *       - Clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: María Pérez
 *               identification:
 *                 type: string
 *                 example: 1712345678
 *               phone:
 *                 type: string
 *                 example: +593 987654321
 *               email:
 *                 type: string
 *                 example: maria@example.com
 *               preferences:
 *                 type: string
 *                 example: Prefiere productos orgánicos
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *
 * /api/v1/clients/{id}:
 *   put:
 *     summary: Actualizar la información de un cliente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: +593 999888777
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 */

router.get('/', clientsController.getClients);
router.post('/', clientsController.addClient);
router.put('/:id', clientsController.updateClient);

export default router;
