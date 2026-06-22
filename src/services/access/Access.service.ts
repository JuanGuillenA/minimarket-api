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
        return await this.accessRepo.fetchAllUsers();
    }

    async registerUser(data: any) {
        if (!data.username || !data.password || !data.fullName || !data.roleId) {
            throw new Error('Faltan datos obligatorios para crear el usuario');
        }
        
        // En un entorno real, aquí se encriptaría la contraseña antes de guardarla.
        // Para este proyecto, la guardaremos y procesaremos directamente.
        
        return await this.accessRepo.saveUser(data);
    }
}