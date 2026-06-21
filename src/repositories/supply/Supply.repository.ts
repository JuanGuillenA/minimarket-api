import Supplier from '../../models/supply/Suppliers.model';
import RestockOrder from '../../models/supply/RestockOrders.model';

export class SupplyRepository {
    async fetchActiveSuppliers() {
        return await Supplier.find({ isActive: true });
    }

    async saveSupplier(supplierData: any) {
        const newSupplier = new Supplier(supplierData);
        return await newSupplier.save();
    }

    async saveRestockOrder(orderData: any) {
        const newOrder = new RestockOrder(orderData);
        return await newOrder.save();
    }
}