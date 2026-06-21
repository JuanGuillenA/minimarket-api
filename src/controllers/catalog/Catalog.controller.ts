import { Request, Response } from 'express';
import { CatalogService } from '../../services/catalog/Catalog.service';

export class CatalogController {
    private catalogService: CatalogService;

    constructor() {
        this.catalogService = new CatalogService();
    }

    // Métodos para Artículos
    public getArticles = async (req: Request, res: Response) => {
        try {
            const articles = await this.catalogService.getInventoryList();
            res.status(200).json({ success: true, data: articles });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addArticle = async (req: Request, res: Response) => {
        try {
            const newArticle = await this.catalogService.createNewArticle(req.body);
            res.status(201).json({ success: true, data: newArticle });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    // Métodos para Secciones
    public getSections = async (req: Request, res: Response) => {
        try {
            const sections = await this.catalogService.getActiveSections();
            res.status(200).json({ success: true, data: sections });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public addSection = async (req: Request, res: Response) => {
        try {
            const newSection = await this.catalogService.createNewSection(req.body);
            res.status(201).json({ success: true, data: newSection });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}