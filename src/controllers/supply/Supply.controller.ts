import { Request, Response } from 'express';
import { SupplyService } from '../../services/supply/Supply.service';

export class SupplyController {
    private supplyService: SupplyService;

    constructor() {
        this.supplyService = new SupplyService();
    }

    public getSuppliers = async (req: Request, res: Response) => {
        try {
            const suppliers = await this.supplyService.getSuppliersList();
            res.status(200).json({ success: true, data: suppliers });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addSupplier = async (req: Request, res: Response) => {
        try {
            const newSupplier = await this.supplyService.registerNewSupplier(req.body);
            res.status(201).json({ success: true, data: newSupplier });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addRestockOrder = async (req: Request, res: Response) => {
        try {
            const newOrder = await this.supplyService.registerRestockEntry(req.body);
            res.status(201).json({ success: true, data: newOrder });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}
