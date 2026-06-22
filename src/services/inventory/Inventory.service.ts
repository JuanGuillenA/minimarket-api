import { InventoryRepository } from '../../repositories/inventory/Inventory.repository';

export class InventoryService {
    private inventoryRepo: InventoryRepository;

    constructor() {
        this.inventoryRepo = new InventoryRepository();
    }

    async recordMovement(data: any) {
        if (!data.productId || !data.type || !data.quantity || !data.reference) {
            throw new Error('Datos incompletos para movimiento de inventario');
        }

        const article = await this.inventoryRepo.findArticleByBarcode(data.productId);
        if (!article) {
            throw new Error('Artículo no encontrado');
        }

        const quantity = Number(data.quantity);
        if (data.type === 'exit' && article.stockLevel < quantity) {
            throw new Error('Stock insuficiente para el movimiento');
        }

        const change = data.type === 'entry' ? quantity : -quantity;
        await this.inventoryRepo.updateArticleStock(article._id, change);

        return await this.inventoryRepo.saveInventoryMovement({
            productId: article._id,
            type: data.type,
            quantity,
            reference: data.reference,
            userId: data.userId,
            notes: data.notes || ''
        });
    }
}
