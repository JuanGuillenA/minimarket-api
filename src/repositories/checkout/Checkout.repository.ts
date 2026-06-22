import CashRegister from '../../models/checkout/CashRegisters.model';
import Transaction from '../../models/checkout/Transactions.model';
import CashMovement from '../../models/checkout/CashMovements.model';

export class CheckoutRepository {
    async fetchAllRegisters() {
        return await CashRegister.find({});
    }

    async saveRegister(registerData: any) {
        const newRegister = new CashRegister(registerData);
        return await newRegister.save();
    }

    async findRegisterById(registerId: string) {
        return await CashRegister.findById(registerId);
    }

    async updateRegisterBalance(registerId: string, amount: number) {
        return await CashRegister.findByIdAndUpdate(registerId, { $inc: { currentBalance: amount } }, { new: true });
    }

    async closeRegister(registerId: string, closureData: any) {
        return await CashRegister.findByIdAndUpdate(registerId, {
            status: 'closed',
            countedBalance: closureData.countedBalance,
            difference: closureData.difference,
            currentBalance: closureData.currentBalance,
            cashierId: closureData.cashierId
        }, { new: true });
    }

    async saveTransaction(transactionData: any) {
        const newTransaction = new Transaction(transactionData);
        return await newTransaction.save();
    }

    async saveCashMovement(movementData: any) {
        const newMovement = new CashMovement(movementData);
        return await newMovement.save();
    }
}