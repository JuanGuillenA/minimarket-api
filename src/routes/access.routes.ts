import { Router } from 'express';
import { AccessController } from '../controllers/access/Access.controller';

const router = Router();
const accessController = new AccessController();

/**
 * @swagger
 * /api/v1/access/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags:
 *       - Accesos
 *     responses:
 *       200:
 *         description: Lista de roles del sistema
 *   post:
 *     summary: Crear un nuevo rol
 *     tags:
 *       - Accesos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: Administrador
 *               description:
 *                 type: string
 *                 example: Acceso total al minimarket
 *     responses:
 *       201:
 *         description: Rol guardado en la base de datos
 *
 * /api/v1/access/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Accesos
 *     responses:
 *       200:
 *         description: Lista de usuarios del sistema
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - Accesos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan123
 *               password:
 *                 type: string
 *                 example: MiClave123
 *               fullName:
 *                 type: string
 *                 example: Juan Pérez
 *               roleId:
 *                 type: string
 *                 example: 64a8d1a2f1c2e3b4c5d6e7f8
 *     responses:
 *       201:
 *         description: Usuario guardado en la base de datos
 *
 * /api/v1/access/login:
 *   post:
 *     summary: Autenticar un usuario y obtener token JWT
 *     tags:
 *       - Accesos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan123
 *               password:
 *                 type: string
 *                 example: MiClave123
 *     responses:
 *       200:
 *         description: Token de autenticación generado correctamente
 */

// Rutas de Roles
router.get('/roles', accessController.getRoles);
router.post('/roles', accessController.addRole);

// Rutas de Usuarios
router.get('/users', accessController.getUsers);
router.post('/users', accessController.addUser);
router.post('/login', accessController.loginUser);

export default router;