import { Schema, model } from 'mongoose';

const cashMovementSchema = new Schema({
    registerId: { type: Schema.Types.ObjectId, ref: 'CashRegister', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'transfer', 'other'], required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, default: '' },
    movementDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default model('CashMovement', cashMovementSchema);
