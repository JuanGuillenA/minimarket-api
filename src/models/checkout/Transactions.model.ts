import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    registerId: { type: Schema.Types.ObjectId, ref: 'CashRegister', required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'transfer'], required: true },
    itemsSold: [{
        articleCode: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true }
}, { timestamps: true });

export default model('Transaction', transactionSchema);