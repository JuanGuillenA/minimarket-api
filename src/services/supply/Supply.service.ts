import { SupplyRepository } from '../../repositories/supply/Supply.repository';

export class SupplyService {
    private supplyRepo: SupplyRepository;

    constructor() {
        this.supplyRepo = new SupplyRepository();
    }

    async getSuppliersList() {
        return await this.supplyRepo.fetchActiveSuppliers();
    }

    async registerNewSupplier(data: any) {
        if (!data.companyName || !data.contactEmail || !data.phoneNumber) {
            throw new Error('Faltan datos obligatorios del proveedor');
        }
        return await this.supplyRepo.saveSupplier(data);
    }

    async registerRestockEntry(data: any) {
        if (!data.supplierId || !data.itemsReceived || data.itemsReceived.length === 0) {
            throw new Error('La orden de reabastecimiento está incompleta');
        }

        // Calcular el costo total de la orden automáticamente
        let totalCost = 0;
        for (const item of data.itemsReceived) {
            totalCost += (item.quantity * item.unitCost);
        }
        data.totalOrderCost = totalCost;

        return await this.supplyRepo.saveRestockOrder(data);
    }
}