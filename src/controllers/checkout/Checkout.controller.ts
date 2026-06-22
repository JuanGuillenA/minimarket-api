import { Request, Response } from 'express';
import { CheckoutService } from '../../services/checkout/Checkout.service';

export class CheckoutController {
    private checkoutService: CheckoutService;

    constructor() {
        this.checkoutService = new CheckoutService();
    }

    public getRegisters = async (req: Request, res: Response) => {
        try {
            const registers = await this.checkoutService.getCashRegisters();
            res.status(200).json({ success: true, data: registers });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addRegister = async (req: Request, res: Response) => {
        try {
            const newRegister = await this.checkoutService.createCashRegister(req.body);
            res.status(201).json({ success: true, data: newRegister });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public processNewSale = async (req: Request, res: Response) => {
        try {
            const newTransaction = await this.checkoutService.processSale(req.body);
            res.status(201).json({ success: true, data: newTransaction });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public closeRegister = async (req: Request, res: Response) => {
        try {
            const closedRegister = await this.checkoutService.closeRegister(req.body);
            res.status(200).json({ success: true, data: closedRegister });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addCashMovement = async (req: Request, res: Response) => {
        try {
            const movement = await this.checkoutService.addCashMovement(req.body);
            res.status(201).json({ success: true, data: movement });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}
