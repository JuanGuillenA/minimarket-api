import { Request, Response } from 'express';
import { ReportsService } from '../../services/reports/Reports.service';

export class ReportsController {
    private reportsService: ReportsService;

    constructor() {
        this.reportsService = new ReportsService();
    }

    public inventoryReport = async (req: Request, res: Response) => {
        try {
            const report = await this.reportsService.generateInventoryReport();
            res.status(200).json({ success: true, data: report });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public salesReport = async (req: Request, res: Response) => {
        try {
            const report = await this.reportsService.generateSalesReport();
            res.status(200).json({ success: true, data: report });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public clientsReport = async (req: Request, res: Response) => {
        try {
            const report = await this.reportsService.generateClientsReport();
            res.status(200).json({ success: true, data: report });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}
