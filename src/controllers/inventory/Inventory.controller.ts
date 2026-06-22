import { Request, Response } from 'express';
import { InventoryService } from '../../services/inventory/Inventory.service';

export class InventoryController {
    private inventoryService: InventoryService;

    constructor() {
        this.inventoryService = new InventoryService();
    }

    public addMovement = async (req: Request, res: Response) => {
        try {
            const movement = await this.inventoryService.recordMovement(req.body);
            res.status(201).json({ success: true, data: movement });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}
