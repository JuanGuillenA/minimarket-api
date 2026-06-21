import { CatalogRepository } from '../../repositories/catalog/Catalog.repository';

export class CatalogService {
    private catalogRepo: CatalogRepository;

    constructor() {
        this.catalogRepo = new CatalogRepository();
    }

    async getInventoryList() {
        return await this.catalogRepo.fetchAllArticles();
    }

    async createNewArticle(data: any) {
        if (!data.barcode || !data.name || !data.retailPrice) {
            throw new Error('Faltan datos obligatorios para el artículo');
        }
        return await this.catalogRepo.persistArticle(data);
    }

    async getActiveSections() {
        return await this.catalogRepo.fetchAllSections();
    }

    async createNewSection(data: any) {
        if (!data.name) {
            throw new Error('El nombre de la sección es obligatorio');
        }
        return await this.catalogRepo.persistSection(data);
    }
}