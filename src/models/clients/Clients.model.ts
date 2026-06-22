import { Schema, model } from 'mongoose';

const clientSchema = new Schema({
    name: { type: String, required: true },
    identification: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    preferences: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Client', clientSchema);
