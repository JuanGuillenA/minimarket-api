import { Router } from 'express';
import { ReportsController } from '../controllers/reports/Reports.controller';

const router = Router();
const reportsController = new ReportsController();

/**
 * @swagger
 * /api/v1/reports/inventory:
 *   get:
 *     summary: Obtener reporte de inventario actualizado
 *     tags:
 *       - Reportes
 *     responses:
 *       200:
 *         description: Reporte de inventario generado correctamente
 *
 * /api/v1/reports/sales:
 *   get:
 *     summary: Obtener reporte de ventas
 *     tags:
 *       - Reportes
 *     responses:
 *       200:
 *         description: Reporte de ventas generado correctamente
 *
 * /api/v1/reports/clients:
 *   get:
 *     summary: Obtener reporte de clientes frecuentes
 *     tags:
 *       - Reportes
 *     responses:
 *       200:
 *         description: Reporte de clientes generado correctamente
 */

router.get('/inventory', reportsController.inventoryReport);
router.get('/sales', reportsController.salesReport);
router.get('/clients', reportsController.clientsReport);

export default router;
