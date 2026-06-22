import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AccessRepository } from '../../repositories/access/Access.repository';

export class AccessService {
    private accessRepo: AccessRepository;

    constructor() {
        this.accessRepo = new AccessRepository();
    }

    async getSystemRoles() {
        return await this.accessRepo.fetchActiveRoles();
    }

    async createNewRole(data: any) {
        if (!data.roleName || !data.description) {
            throw new Error('El nombre del rol y la descripción son obligatorios');
        }
        return await this.accessRepo.saveRole(data);
    }

    async getSystemUsers() {
        const users = await this.accessRepo.fetchAllUsers();
        return users.map((user: any) => ({
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.roleId,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
    }

    async registerUser(data: any) {
        if (!data.username || !data.password || !data.fullName || !data.roleId) {
            throw new Error('Faltan datos obligatorios para crear el usuario');
        }

        const existingUser = await this.accessRepo.fetchUserByUsername(data.username);
        if (existingUser) {
            throw new Error('El nombre de usuario ya existe');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        data.password = passwordHash;

        return await this.accessRepo.saveUser(data);
    }

    async loginUser(data: any) {
        if (!data.username || !data.password) {
            throw new Error('Usuario y contraseña son obligatorios');
        }

        const user = await this.accessRepo.fetchUserByUsername(data.username);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) {
            throw new Error('Credenciales inválidas');
        }

        const role = (user.roleId as any) || {};

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                roleId: user.roleId,
                roleName: role.roleName
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '8h' }
        );

        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                roleId: user.roleId,
                roleName: role.roleName
            }
        };
    }
}