import CashRegister from '../../models/checkout/CashRegisters.model';
import Transaction from '../../models/checkout/Transactions.model';

export class CheckoutRepository {
    async fetchAllRegisters() {
        return await CashRegister.find({});
    }

    async saveRegister(registerData: any) {
        const newRegister = new CashRegister(registerData);
        return await newRegister.save();
    }

    async saveTransaction(transactionData: any) {
        const newTransaction = new Transaction(transactionData);
        return await newTransaction.save();
    }
}