import Article from '../../models/catalog/Articles.model';
import InventoryMovement from '../../models/inventory/InventoryMovement.model';

export class InventoryRepository {
    async fetchAllMovements() {
        return await InventoryMovement.find({}).populate('productId', 'barcode name');
    }

    async findArticleByBarcode(barcode: string) {
        return await Article.findOne({ barcode });
    }

    async updateArticleStock(articleId: any, change: number) {
        return await Article.findByIdAndUpdate(articleId, { $inc: { stockLevel: change } }, { new: true });
    }

    async saveInventoryMovement(movementData: any) {
        const newMovement = new InventoryMovement(movementData);
        return await newMovement.save();
    }
}
