import { Request, Response } from 'express';
import { ClientsService } from '../../services/clients/Clients.service';

export class ClientsController {
    private clientsService: ClientsService;

    constructor() {
        this.clientsService = new ClientsService();
    }

    public getClients = async (req: Request, res: Response) => {
        try {
            const clients = await this.clientsService.getClients();
            res.status(200).json({ success: true, data: clients });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addClient = async (req: Request, res: Response) => {
        try {
            const newClient = await this.clientsService.createClient(req.body);
            res.status(201).json({ success: true, data: newClient });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public updateClient = async (req: Request, res: Response) => {
        try {
            const updatedClient = await this.clientsService.updateClient(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedClient });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}
