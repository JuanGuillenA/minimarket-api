import { Schema, model } from 'mongoose';

const inventoryMovementSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    type: { type: String, enum: ['entry', 'exit'], required: true },
    quantity: { type: Number, required: true },
    reference: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    movementDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
}, { timestamps: true });

export default model('InventoryMovement', inventoryMovementSchema);
