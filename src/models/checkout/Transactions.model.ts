import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    registerId: { type: Schema.Types.ObjectId, ref: 'CashRegister', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    cashierId: { type: Schema.Types.ObjectId, ref: 'User' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'transfer'], required: true },
    itemsSold: [{
        articleCode: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
}, { timestamps: true });

export default model('Transaction', transactionSchema);