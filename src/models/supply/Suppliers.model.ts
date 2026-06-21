import { Schema, model } from 'mongoose';

const supplierSchema = new Schema({
    companyName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Supplier', supplierSchema);