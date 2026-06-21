import { Schema, model } from 'mongoose';

const cashRegisterSchema = new Schema({
    registerNumber: { type: Number, required: true, unique: true },
    status: { type: String, enum: ['open', 'closed'], default: 'closed' },
    currentBalance: { type: Number, default: 0 }
}, { timestamps: true });

export default model('CashRegister', cashRegisterSchema);