import { CheckoutRepository } from '../../repositories/checkout/Checkout.repository';

export class CheckoutService {
    private checkoutRepo: CheckoutRepository;

    constructor() {
        this.checkoutRepo = new CheckoutRepository();
    }

    async getCashRegisters() {
        return await this.checkoutRepo.fetchAllRegisters();
    }

    async createCashRegister(data: any) {
        if (!data.registerNumber) {
            throw new Error('El número de caja es obligatorio');
        }
        return await this.checkoutRepo.saveRegister(data);
    }

    async processSale(data: any) {
        if (!data.registerId || !data.paymentMethod || !data.itemsSold || data.itemsSold.length === 0) {
            throw new Error('La transacción está incompleta');
        }

        // Calcular el costo total de la venta automáticamente
        let total = 0;
        for (const item of data.itemsSold) {
            total += (item.quantity * item.unitPrice);
        }
        data.totalAmount = total;

        return await this.checkoutRepo.saveTransaction(data);
    }
}