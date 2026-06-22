import { CheckoutRepository } from '../../repositories/checkout/Checkout.repository';
import { InventoryRepository } from '../../repositories/inventory/Inventory.repository';

export class CheckoutService {
    private checkoutRepo: CheckoutRepository;
    private inventoryRepo: InventoryRepository;

    constructor() {
        this.checkoutRepo = new CheckoutRepository();
        this.inventoryRepo = new InventoryRepository();
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

        let subtotal = 0;
        for (const item of data.itemsSold) {
            const article = await this.inventoryRepo.findArticleByBarcode(item.articleCode);
            if (!article) {
                throw new Error(`Artículo no encontrado: ${item.articleCode}`);
            }

            const quantity = Number(item.quantity);
            if (article.stockLevel < quantity) {
                throw new Error(`Stock insuficiente para el artículo ${item.articleCode}`);
            }

            subtotal += quantity * item.unitPrice;
            await this.inventoryRepo.updateArticleStock(article._id, -quantity);
            await this.inventoryRepo.saveInventoryMovement({
                productId: article._id,
                type: 'exit',
                quantity,
                reference: `Venta en caja ${data.registerId}`,
                userId: data.userId || null,
                notes: data.notes || 'Venta realizada'
            });
        }

        const discount = Number(data.discount) || 0;
        const totalAmount = subtotal - discount;

        data.subtotal = subtotal;
        data.discount = discount;
        data.totalAmount = totalAmount;

        await this.checkoutRepo.updateRegisterBalance(data.registerId, totalAmount);
        await this.checkoutRepo.saveCashMovement({
            registerId: data.registerId,
            type: 'income',
            amount: totalAmount,
            paymentMethod: data.paymentMethod,
            userId: data.cashierId || null,
            description: 'Venta en caja'
        });

        return await this.checkoutRepo.saveTransaction(data);
    }

    async closeRegister(data: any) {
        if (!data.registerId || data.countedBalance == null) {
            throw new Error('Datos incompletos para cerrar la caja');
        }

        const register = await this.checkoutRepo.findRegisterById(data.registerId);
        if (!register) {
            throw new Error('Registro de caja no encontrado');
        }

        const countedBalance = Number(data.countedBalance);
        const difference = countedBalance - register.currentBalance;

        return await this.checkoutRepo.closeRegister(data.registerId, {
            countedBalance,
            difference,
            currentBalance: register.currentBalance,
            cashierId: data.cashierId || null
        });
    }

    async addCashMovement(data: any) {
        if (!data.registerId || !data.type || data.amount == null || !data.paymentMethod) {
            throw new Error('Datos incompletos para movimiento de caja');
        }

        if (!['income', 'expense'].includes(data.type)) {
            throw new Error('Tipo de movimiento inválido');
        }

        const amount = Number(data.amount);
        await this.checkoutRepo.updateRegisterBalance(data.registerId, data.type === 'income' ? amount : -amount);

        return await this.checkoutRepo.saveCashMovement({
            registerId: data.registerId,
            type: data.type,
            amount,
            paymentMethod: data.paymentMethod,
            userId: data.userId || null,
            description: data.description || ''
        });
    }
}