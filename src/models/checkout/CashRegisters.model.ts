import { Schema, model } from 'mongoose';

const cashRegisterSchema = new Schema({
    registerNumber: { type: Number, required: true, unique: true },
    status: { type: String, enum: ['open', 'closed'], default: 'closed' },
    initialBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    countedBalance: { type: Number, default: 0 },
    difference: { type: Number, default: 0 },
    cashierId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default model('CashRegister', cashRegisterSchema);