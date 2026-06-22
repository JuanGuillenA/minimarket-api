import { Request, Response } from 'express';
import { AccessService } from '../../services/access/Access.service';

export class AccessController {
    private accessService: AccessService;

    constructor() {
        this.accessService = new AccessService();
    }

    // Métodos para Roles
    public getRoles = async (req: Request, res: Response) => {
        try {
            const roles = await this.accessService.getSystemRoles();
            res.status(200).json({ success: true, data: roles });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addRole = async (req: Request, res: Response) => {
        try {
            const newRole = await this.accessService.createNewRole(req.body);
            res.status(201).json({ success: true, data: newRole });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    // Métodos para Usuarios
    public getUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.accessService.getSystemUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addUser = async (req: Request, res: Response) => {
        try {
            const newUser = await this.accessService.registerUser(req.body);
            res.status(201).json({ success: true, data: newUser });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}