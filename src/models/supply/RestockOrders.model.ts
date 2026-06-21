import { Schema, model } from 'mongoose';

const restockSchema = new Schema({
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    itemsReceived: [{
        articleCode: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitCost: { type: Number, required: true }
    }],
    totalOrderCost: { type: Number, required: true }
}, { timestamps: true });

export default model('RestockOrder', restockSchema);